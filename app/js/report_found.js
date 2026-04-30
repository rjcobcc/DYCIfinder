import { clearImage, previewImage } from '../lib/img_preview.js';
import { getResizedImage } from '../lib/img_resizer.js';
import { popupMessage } from '../lib/popups.js';
import { loadSelection } from '../lib/util.js';
import { API_URL } from '../conf/api.js';

let runningPostFoundReport = false;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submit-foundpost-btn").addEventListener("click", postFoundReport)
    document.getElementById("foundpost-image").addEventListener("change", function () { previewImage(this, "preview-image", "remove-image"); });
    document.getElementById("remove-image").addEventListener("click", function () { clearImage("foundpost-image", "preview-image", "remove-image"); });
    
    loadSelection("foundpost-itemcategory", "get_itemcategories.php", "category_name");
    loadSelection("foundpost-findlocation", "get_campuslocations.php", "location_name");
    loadUserInfo();
});



async function loadUserInfo() {
    try {
        const result = await fetch(API_URL + "/get_user_info.php", {method: "POST"});
        const response = await result.json();
        console.log(response);

        document.getElementById("student-id").value = response.data.user.student_id ?? "";
        document.getElementById("full-name").value = response.data.user.full_name ?? "";
        document.getElementById("email-address").value = response.data.user.email_address ?? "";
        document.getElementById("phone-number").value = response.data.user.phone_number ?? "";
        document.getElementById("fbprofile-url").value = response.data.user.facebook_url ?? "";
        document.getElementById("course-section").value = response.data.user.course_section ?? "";
    }
    catch (error) {
        console.error(error);
        console.log("Failed to preload user info for the found report.");
    }
}



async function postFoundReport() {
    if (runningPostFoundReport) return;
    runningPostFoundReport = true;

    const description = document.getElementById("foundpost-description").value.trim(); 
    const category = document.getElementById("foundpost-itemcategory").value.trim(); 
    const location = document.getElementById("foundpost-findlocation").value.trim(); 
    const finder = document.getElementById("full-name").value.trim();
    const item = document.getElementById("foundpost-itemname").value.trim(); 
    const imageFile = document.getElementById("foundpost-image").files[0];
    const date = document.getElementById("foundpost-finddate").value;
    const studentID = document.getElementById("student-id").value;
    const fburl = document.getElementById("fbprofile-url").value;
    const phone = document.getElementById("phone-number").value;
    const email = document.getElementById("email-address").value;   
    const coursection = document.getElementById("course-section").value; 

    let invalidMessage = null;
    if (!item) 
        invalidMessage = "Item name is required.";  
    else if (!category) 
        invalidMessage = "Item Category is required."; 
    else if (!description) 
        invalidMessage = "Item Description is required."; 
    else if (!imageFile) 
        invalidMessage = "Item Photo is required."; 
    else if (!location) 
        invalidMessage = "Find Location is required."; 
    else if (!date) 
        invalidMessage = "Find Date is required."; 
    else if (!finder) 
        invalidMessage = "Finder Name is required.";
    else if (!coursection)
        invalidMessage = "Course & Section is required.";
    else if (!studentID)
        invalidMessage = "Student ID is required."; 

    if (invalidMessage) {
        await popupMessage(invalidMessage);
        runningPostFoundReport = false;
        return;
    }

    try {
        const formData = new FormData();
        const resized = await getResizedImage(imageFile);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("location", location);
        formData.append("image", resized);
        formData.append("finder", finder);
        formData.append("item", item);
        formData.append("date", date);
        formData.append("studentID", studentID);
        formData.append("fburl", fburl);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("coursection", coursection);
        
        const result = await fetch(API_URL + "/post_foundreport.php", {
            method: "POST",
            body: formData
        });
        const response = await result.json();
        console.log(response)

        if (response.success) {
            await popupMessage("Thank you! Please drop off the item at the office to proceed.<br><br>Your report's ID is: " + response.data['found_report_id']);
            window.location.href = response.redirect;
        }
        else throw new Error();
    }
    catch (error) {
        console.error(error);
        await popupMessage("An error occurred.<br><br>Please try again.");
    }
    finally {
        runningPostFoundReport = false;
    }
}