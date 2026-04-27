import { API_URL } from '../conf/api.js';
import { getResizedImage } from '../lib/img_resizer.js';
import { popupMessage } from '../lib/popups.js';
import { loadSelection } from '../lib/util.js';
import { clearImage, previewImage } from '../lib/img_preview.js';

let runningPostLostItemReport = false;

loadSelection("lostpost-itemcategory", "get_itemcategories.php", "category_name");
loadSelection("lostpost-lostlocation", "get_campuslocations.php", "location_name");

document.getElementById("submit-lostpost-btn").addEventListener("click", postLostItemReport);
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("lostpost-image1").addEventListener("change", function () { previewImage(this, "preview-image1", "remove-image1"); });
    document.getElementById("lostpost-image2").addEventListener("change", function () { previewImage(this, "preview-image2", "remove-image2"); });
    document.getElementById("remove-image1").addEventListener("click", function () { clearImage("lostpost-image1", "preview-image1", "remove-image1"); });
    document.getElementById("remove-image2").addEventListener("click", function () { clearImage("lostpost-image2", "preview-image2", "remove-image2"); });
});



async function postLostItemReport() {
    if (runningPostLostItemReport) 
        return;
    runningPostLostItemReport = true;

    const item = document.getElementById("lostpost-itemname").value.trim();
    const category = document.getElementById("lostpost-itemcategory").value.trim();
    const description = document.getElementById("lostpost-description").value.trim();
    const location = document.getElementById("lostpost-lostlocation").value.trim();
    const date = document.getElementById("lostpost-lostdate").value;
    const loster = document.getElementById("lostitem-ownername").value.trim();
    const facebook = document.getElementById("lostowner-fbprofile").value.trim();
    const contact = document.getElementById("lostowner-contactno").value.trim();
    const email = document.getElementById("lostowner-email").value.trim();
    const image1File = document.getElementById("lostpost-image1").files[0];
    const image2File = document.getElementById("lostpost-image2").files[0];

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

    const resized1 = await getResizedImage(image1File);
    const resized2 = await getResizedImage(image2File);
    const formData = new FormData();
    formData.append("item", item);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("loster", loster);
    formData.append("facebook", facebook);
    formData.append("contact", contact);
    formData.append("email", email);
    formData.append("image1", resized1);
    formData.append("image2", resized2);
    
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
        else 
            throw new Error();
    }
    catch (e) {
        console.log(e);
        await popupMessage("An error occurred.<br><br>Please try again.");

        runningPostLostItemReport = false;
        return;
    }
}