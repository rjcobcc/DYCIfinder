import { previewImage, clearImage } from '../lib/img_preview.js';
import { getResizedImage } from '../lib/img_resizer.js';
import { popupLoading, popupMessage } from '../lib/popups.js';
import { API_URL } from '../conf/api.js';
import { getUserInfo } from '../lib/util.js';

const itemID = new URLSearchParams(window.location.search).get('item_id');
let runningClaimPost = false;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("claim-btn").addEventListener("click", claimPost);
    document.getElementById("claimpost-image").addEventListener("change", function () { previewImage(this, "preview-image", "remove-image"); });
    document.getElementById("remove-image").addEventListener("click", function () { clearImage("claimpost-image", "preview-image", "remove-image"); });
    
    loadItemInfo();
    loadUserInfo();
});



async function loadItemInfo() {
    if (itemID == null || itemID == "") window.location.href = "search_found.html";
    try {
        const result = await fetch(API_URL + "/post_claim/get_foundreport.php", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                id: itemID
            })
        });
        const response = await result.json();
        console.log(response);

        if (!response.success) throw new Error();

        const data = response.data;
        document.getElementById("claim-itemcategory").textContent = data.item_category;
        document.getElementById("claim-findlocation").textContent = data.find_location;
        document.getElementById("claim-finddate").textContent = data.find_date;
        document.getElementById("claim-itemname").textContent = data.item_name;
    } 
    catch (error) {
        console.error(error);
        popupMessage("Failed to load item info.<br>Please try again.");
    }
}



async function loadUserInfo() {
    const data = await getUserInfo();
    if (!data) return;
    document.getElementById("claim-ownername").value = data.user.full_name ?? "";
    document.getElementById("claim-studentid").value = data.user.student_id ?? "";
    document.getElementById("claim-coursesection").value = data.user.course_section ?? "";
    document.getElementById("claim-fbprofile").value = data.user.facebook_url ?? "";
    document.getElementById("claim-email").value = data.user.email_address ?? "";
    document.getElementById("claim-contactno").value = data.user.phone_number ?? "";
}



async function claimPost() {
    if (runningClaimPost) return;
    runningClaimPost = true;

    const claimpostDescription = document.getElementById("claimpost-description").value.trim();
    const claimpostOwnerphone = document.getElementById("claim-contactno").value.trim();
    const claimpostOwnername = document.getElementById("claim-ownername").value.trim();
    const claimpostStudentid = document.getElementById("claim-studentid").value.trim();
    const claimpostCoursesection = document.getElementById("claim-coursesection").value.trim();
    const claimpostOwnerfb = document.getElementById("claim-fbprofile").value.trim();
    const claimpostOwneremail = document.getElementById("claim-email").value.trim();
    const claimpostImage = document.getElementById("claimpost-image").files[0];

    let invalidMessage = null;
    if (!claimpostDescription) 
        invalidMessage = "Item Description is required."; 
    else if (!claimpostImage) 
        invalidMessage = "Item Photo is required."; 
    else if (!claimpostOwnername) 
        invalidMessage = "Name is required."; 
    else if (!claimpostStudentid) 
        invalidMessage = "Student ID is required."; 
    else if (!claimpostCoursesection) 
        invalidMessage = "Course/Section is required."; 
    else if (!claimpostOwnerfb) 
        invalidMessage = "Facebook Profile is required."; 
    else if (!claimpostOwnerphone) 
        invalidMessage = "Phone Number is required.";
    else if (!claimpostOwneremail) 
        invalidMessage = "Email is required."; 
    
    if (invalidMessage) {
        popupMessage(invalidMessage);
        runningClaimPost = false;
        return;
    }

    try {
        popupLoading();

        const formData = new FormData();
        const resized = await getResizedImage(claimpostImage);
        formData.append("claimpost_description", claimpostDescription);
        formData.append("claimpost_ownerphone", claimpostOwnerphone);
        formData.append("claimpost_owneremail", claimpostOwneremail);
        formData.append("claimpost_ownername", claimpostOwnername);
        formData.append("claimpost_studentid", claimpostStudentid);
        formData.append("claimpost_coursesection", claimpostCoursesection);
        formData.append("claimpost_ownerfb", claimpostOwnerfb);
        formData.append("claimpost_image", resized);
        formData.append("item_id", itemID);

        const result = await fetch(API_URL + "/post_claim/post_itemclaim.php", {
            method: "POST",
            body: formData
        });
        const response = await result.json();
        console.log(response);

        if (response.success) {
            await popupMessage("claim post submitted successfully.");
            window.location.href = response.redirect;
        }
        else throw new Error();
    } 
    catch (error) {
        console.error(error);
        popupMessage("Something went wrong.<br>Please try again.");
    }
    finally {
        runningClaimPost = false;
    }
}