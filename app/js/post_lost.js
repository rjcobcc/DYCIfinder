import { API } from '../conf/api.js';
import { resizeImage } from '../lib/img_resizer.js';
import { showOKPopup } from '../lib/popups.js';
import { loadSelectOptions } from '../lib/util.js';

document.getElementById("submitButton").addEventListener("click", postLostItemReport);
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("image1").addEventListener("change", function () { previewImage(this, "preview1", "remove1"); });
    document.getElementById("image2").addEventListener("change", function () { previewImage(this, "preview2", "remove2"); });
    document.getElementById("remove1").addEventListener("click", function () { clearImage("image1", "preview1", "remove1"); });
    document.getElementById("remove2").addEventListener("click", function () { clearImage("image2", "preview2", "remove2"); });
});



let postingLostItemReport = false;

loadSelectOptions("item_category", "get_item_categories.php", "category_name");
loadSelectOptions("lost_location", "get_campus_locations.php", "location_name");



async function postLostItemReport() {
    if (postingLostItemReport) return;
    postingLostItemReport = true;

    const item = document.getElementById("item_name").value.trim();
    const category = document.getElementById("item_category").value.trim();
    const description = document.getElementById("item_description").value.trim();
    const location = document.getElementById("lost_location").value.trim();
    const date = document.getElementById("lost_date").value;
    const loster = document.getElementById("loster_name").value.trim();
    const facebook = document.getElementById("facebook_profile").value.trim();
    const contact = document.getElementById("contact_number").value.trim();
    const email = document.getElementById("email_address").value.trim();
    const image1File = document.getElementById("image1").files[0];
    const image2File = document.getElementById("image2").files[0];

    if (!item) { showOKPopup("Item Name is required."); postingLostItemReport = false; return; }
    if (!category) { showOKPopup("Item Category is required."); postingLostItemReport = false; return; }
    if (!description) { showOKPopup("Item Description is required."); postingLostItemReport = false; return; }
    if (!location) { showOKPopup("Lost Location is required."); postingLostItemReport = false; return; }
    if (!date) { showOKPopup("Lost Date is required."); postingLostItemReport = false; return; }
    if (!loster) { showOKPopup("Your Name is required."); postingLostItemReport = false; return; }

    // prepare form data
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
    if (image1File) {
        const resized1 = await resizeImage(image1File);
        formData.append("image1", resized1);
    }
    if (image2File) {
        const resized2 = await resizeImage(image2File);
        formData.append("image2", resized2);
    }

    // submit form data
    const result = await fetch(API + "/post_lost.php", {
        method: "POST",
        body: formData
    });
    const response = await result.json();

    if (response.success) {
        await showOKPopup("We will notify you if a found item matches your report.<br><br>Your report's ID is: " + response.lost_report_id);
        window.location.href = "search.html";
    } 
    else {
        await showOKPopup("An error occurred.<br><br>Please try again.");
        postingLostItemReport = false;
    }
}



function previewImage(input, previewId, removeBtnId) {
    const preview = document.getElementById(previewId);
    const removeBtn = document.getElementById(removeBtnId);
    const reader = new FileReader();

    if (!input.files || !input.files[0]) {
        clearImage(input.id, previewId, removeBtnId);
        return;
    }

    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
        removeBtn.style.display = "inline-block";
    };

    reader.readAsDataURL(input.files[0]);
}



function clearImage(inputId, previewId, removeBtnId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const removeBtn = document.getElementById(removeBtnId);

    input.value = "";
    preview.src = "";
    preview.style.display = "none";
    removeBtn.style.display = "none";
}