import { clearImage, previewImage } from '../lib/img_preview.js';
import { getResizedImage } from '../lib/img_resizer.js';
import { popupMessage, popupLoading } from '../lib/popups.js';
import { loadSelection } from '../lib/util.js';
import { API_URL } from '../conf/api.js';

let runningPostLostItemReport = false;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submit-lostpost-btn").addEventListener("click", postLostItemReport);
    document.getElementById("lostpost-image").addEventListener("change", function () { previewImage(this, "preview-image", "remove-image"); });
    document.getElementById("remove-image").addEventListener("click", function () { clearImage("lostpost-image", "preview-image", "remove-image"); });
    
    loadSelection("lostpost-lostlocation", "get_campuslocations.php", "location_name");
    loadSelection("lostpost-itemcategory", "get_itemcategories.php", "category_name");
});



async function postLostItemReport() {
    if (runningPostLostItemReport) return;
    runningPostLostItemReport = true;
    
    const description = document.getElementById("lostpost-description").value.trim();
    const category = document.getElementById("lostpost-itemcategory").value.trim();
    const location = document.getElementById("lostpost-lostlocation").value.trim();
    const facebook = document.getElementById("fbprofile-url").value.trim();
    const contact = document.getElementById("phone-number").value.trim();
    const loster = document.getElementById("full-name").value.trim();
    const item = document.getElementById("lostpost-itemname").value.trim();
    const imageFile = document.getElementById("lostpost-image").files[0];
    const email = document.getElementById("email-address").value.trim();
    const date = document.getElementById("lostpost-lostdate").value;
    const coursection = document.getElementById("course-section").value.trim();
    const studentID = document.getElementById("student-id").value.trim();

    let invalidMessage = null;
    if (!item) 
        invalidMessage = "Item Name is required.";
    else if (!category) 
        invalidMessage = "Item Category is required.";
    else if (!description) 
        invalidMessage = "Item Description is required.";
    else if (!imageFile) 
        invalidMessage = "Photos is required.";
    else if (!location) 
        invalidMessage = "Lost Location is required.";
    else if (!date) 
        invalidMessage = "Lost Date is required.";
    else if (!loster) 
        invalidMessage = "Owner Name is required.";
    else if (!coursection) 
        invalidMessage = "Course Section is required.";
    else if (!studentID)
        invalidMessage = "Student ID is required.";
    else if (!facebook) 
        invalidMessage = "Facebook Profile is required.";
    else if (!contact) 
        invalidMessage = "Contact Number is required.";
    

    if (invalidMessage) {
        await popupMessage(invalidMessage);
        runningPostLostItemReport = false;
        return;
    }

    const formData = new FormData();
    const resized = await getResizedImage(imageFile);
    formData.append("description", description);
    formData.append("facebook", facebook);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("contact", contact);
    formData.append("image", resized);
    formData.append("loster", loster);
    formData.append("email", email);
    formData.append("item", item);
    formData.append("date", date);
    formData.append("coursection", coursection);
    formData.append("studentID", studentID);
    
    try {
        popupLoading();
        
        const result = await fetch(API_URL + "/post_lostreport.php", {
            method: "POST",
            body: formData
        });
        const response = await result.json();
        console.log(response);

        if (response.success) {
            await popupMessage("We received your report!<br>You will be notified if a found item matches your report.<br><br>Your report's ID is: " + response.data['lost_report_id']);
            window.location.href = response.redirect;
        } 
        else throw new Error();
    }
    catch (error) {
        console.error(error);
        await popupMessage("An error occurred.<br><br>Please try again.");
    }
    finally {
        runningPostLostItemReport = false;
    }
}