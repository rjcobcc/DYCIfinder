import { clearImage, previewImage } from '../lib/img_preview.js';
import { getResizedImage } from '../lib/img_resizer.js';
import { popupMessage } from '../lib/popups.js';
import { loadSelection } from '../lib/util.js';
import { API_URL } from '../conf/api.js';

let runningPostLostItemReport = false;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submit-lostpost-btn").addEventListener("click", postLostItemReport);
    document.getElementById("lostpost-image1").addEventListener("change", function () { previewImage(this, "preview-image1", "remove-image1"); });
    document.getElementById("lostpost-image2").addEventListener("change", function () { previewImage(this, "preview-image2", "remove-image2"); });
    document.getElementById("remove-image1").addEventListener("click", function () { clearImage("lostpost-image1", "preview-image1", "remove-image1"); });
    document.getElementById("remove-image2").addEventListener("click", function () { clearImage("lostpost-image2", "preview-image2", "remove-image2"); });
    
    loadSelection("lostpost-lostlocation", "get_campuslocations.php", "location_name");
    loadSelection("lostpost-itemcategory", "get_itemcategories.php", "category_name");
});



async function postLostItemReport() {
    if (runningPostLostItemReport) return;
    runningPostLostItemReport = true;
    
    const description = document.getElementById("lostpost-description").value.trim();
    const category = document.getElementById("lostpost-itemcategory").value.trim();
    const location = document.getElementById("lostpost-lostlocation").value.trim();
    const facebook = document.getElementById("lostowner-fbprofile").value.trim();
    const contact = document.getElementById("lostowner-contactno").value.trim();
    const loster = document.getElementById("lostitem-ownername").value.trim();
    const item = document.getElementById("lostpost-itemname").value.trim();
    const image1File = document.getElementById("lostpost-image1").files[0];
    const image2File = document.getElementById("lostpost-image2").files[0];
    const email = document.getElementById("lostowner-email").value.trim();
    const date = document.getElementById("lostpost-lostdate").value;

    let invalidMessage = null;
    if (!item) 
        invalidMessage = "Item Name is required.";
    else if (!category) 
        invalidMessage = "Item Category is required.";
    else if (!description) 
        invalidMessage = "Item Description is required.";
    else if (!location) 
        invalidMessage = "Lost Location is required.";
    else if (!date) 
        invalidMessage = "Lost Date is required.";
    else if (!loster) 
        invalidMessage = "Owner Name is required.";
    else if (!facebook) 
        invalidMessage = "Facebook Profile is required.";
    else if (!contact) 
        invalidMessage = "Contact Number is required.";
    else if (!email) 
        invalidMessage = "Email Address is required.";
    else if (!image1File || !image2File) 
        invalidMessage = "Photos are required.";

    if (invalidMessage) {
        await popupMessage(invalidMessage);
        runningPostLostItemReport = false;
        return;
    }

    const formData = new FormData();
    const resized1 = await getResizedImage(image1File);
    const resized2 = await getResizedImage(image2File);
    formData.append("description", description);
    formData.append("facebook", facebook);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("contact", contact);
    formData.append("image1", resized1);
    formData.append("image2", resized2);
    formData.append("loster", loster);
    formData.append("email", email);
    formData.append("item", item);
    formData.append("date", date);
    
    try {
        const result = await fetch(API_URL + "/post_lostreport.php", {
            method: "POST",
            body: formData
        });
        const response = await result.json();
        console.log(response);

        if (response.success) {
            await popupMessage("We received your report!<br>You will be notified if a found item matches your report.<br><br>Your report's ID is: " + response.data['lost_report_id']);
            window.location.href = "search_found.html";
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