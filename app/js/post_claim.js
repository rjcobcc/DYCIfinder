import { popupMessage } from '../lib/popups.js';
import { API_URL } from '../conf/api.js';
import { previewImage, clearImage } from '../lib/img_preview.js';
import { getResizedImage } from '../lib/img_resizer.js';

const itemID = new URLSearchParams(window.location.search).get('item_id');
let runningClaimPost = false;

loadItemInfo();

document.getElementById("claim-btn").addEventListener("click", claimPost);
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("claimpost-image1").addEventListener("change", function () { previewImage(this, "preview-image1", "remove-image1"); });
    document.getElementById("claimpost-image2").addEventListener("change", function () { previewImage(this, "preview-image2", "remove-image2"); });
    document.getElementById("remove-image1").addEventListener("click", function () { clearImage("claimpost-image1", "preview-image1", "remove-image1"); });
    document.getElementById("remove-image2").addEventListener("click", function () { clearImage("claimpost-image2", "preview-image2", "remove-image2"); });
});



async function loadItemInfo() {
    if (itemID == null || itemID == "") {
        window.location.href = "search_found.html";
    }

    try {
        const result = await fetch(`${API_URL}/get_foundreport.php`, {
            method: "POST",
            headers: {
                "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
                id: itemID
            })
        });
        const response = await result.json();
        console.log(response);

        if (!response.success) 
            throw new Error();

        const data = response.data;
        document.getElementById("claim-itemname").textContent = data.item_name;
        document.getElementById("claim-itemcategory").textContent = data.item_category;
        document.getElementById("claim-findlocation").textContent = data.find_location;
        document.getElementById("claim-finddate").textContent = data.find_date;
    } 
    catch (e) {
        console.log(e);
        popupMessage("Failed to load item info.<br>Please try again.");
    }
}



async function claimPost() {
    if (runningClaimPost) 
        return;
    runningClaimPost = true;

    const claimpostDescription = document.getElementById("claimpost-description").value.trim();
    const claimpostImage1 = document.getElementById("claimpost-image1").files[0];
    const claimpostImage2 = document.getElementById("claimpost-image2").files[0];
    const claimpostOwnername = document.getElementById("claim-ownername").value.trim();
    const claimpostOwnerfb = document.getElementById("claim-fbprofile").value.trim();
    const claimpostOwnerphone = document.getElementById("claim-contactno").value.trim();
    const claimpostOwneremail = document.getElementById("claim-email").value.trim();

    let invalidMessage = null;
    if (!claimpostDescription) 
        invalidMessage = "Item Description is required."; 
    else if (!claimpostImage1 || !claimpostImage2) 
        invalidMessage = "Item Photos are required."; 
    else if (!claimpostOwnername) 
        invalidMessage = "Name is required."; 
    else if (!claimpostOwnerfb) 
        invalidMessage = "Facebook Profile is required."; 
    else if (!claimpostOwnerphone) 
        invalidMessage = "Phone Number is required.";
    else if (!claimpostOwneremail) 
        invalidMessage = "Email is required."; 

    if (invalidMessage) {
        popupMessage(invalidMessage, "error");
        runningClaimPost = false;
        return;
    }

    try {
        const resized1 = await getResizedImage(claimpostImage1);
        const resized2 = await getResizedImage(claimpostImage2);
        const formData = new FormData();
        formData.append("item_id", itemID);
        formData.append("claimpost_description", claimpostDescription);
        formData.append("claimpost_ownername", claimpostOwnername);
        formData.append("claimpost_ownerfb", claimpostOwnerfb);
        formData.append("claimpost_ownerphone", claimpostOwnerphone);
        formData.append("claimpost_owneremail", claimpostOwneremail);
        formData.append("claimpost_image1", resized1);
        formData.append("claimpost_image2", resized2);

        const result = await fetch(`${API_URL}/post_itemclaim.php`, {
            method: "POST",
            body: formData
        });

        const response = await result.json();
        console.log(response);

        if (response.success) {
            await popupMessage("claim post submitted successfully.");
            window.location.href = "search_found.html";
        }
        else
            throw new Error();
    } 
    catch (e) {
        console.log(e);
        popupMessage("Something went wrong.<br>Please try again.");
    }
    finally {
        runningClaimPost = false;
    }
}