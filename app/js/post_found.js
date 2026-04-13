import { API } from '../conf/api.js';
import { resizeImage } from '../lib/img_resizer.js';
import { showOKPopup } from '../lib/popups.js';
import { loadSelectOptions } from '../lib/util.js';

document.getElementById("submitButton").addEventListener("click", postFoundItemReport)
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("image1").addEventListener("change", function () { previewImage(this, "preview1", "remove1"); });
    document.getElementById("image2").addEventListener("change", function () { previewImage(this, "preview2", "remove2"); });
    document.getElementById("remove1").addEventListener("click", function () { clearImage("image1", "preview1", "remove1"); });
    document.getElementById("remove2").addEventListener("click", function () { clearImage("image2", "preview2", "remove2"); });
});

let postingFoundItemReport = false;

loadSelectOptions("category", "get_item_categories.php", "category_name");
loadSelectOptions("location", "get_campus_locations.php", "location_name");



async function postFoundItemReport() {
    if (postingFoundItemReport) return;
    postingFoundItemReport = true;

    const finder = document.getElementById("finder").value.trim();
    const item = document.getElementById("item").value.trim(); 
    const category = document.getElementById("category").value.trim(); 
    const description = document.getElementById("description").value.trim(); 
    const location = document.getElementById("location").value.trim(); 
    const date = document.getElementById("date").value;
    const image1File = document.getElementById("image1").files[0];
    const image2File = document.getElementById("image2").files[0];

    if (!finder) { showOKPopup("Finder name is required."); postingFoundItemReport = false; return; }
    if (!item) { showOKPopup("Item name is required."); postingFoundItemReport = false; return; }
    if (!category) { showOKPopup("Item Category is required."); postingFoundItemReport = false; return; }
    if (!description) { showOKPopup("Item Description is required."); postingFoundItemReport = false; return; }
    if (!location) { showOKPopup("Find Location is required."); postingFoundItemReport = false; return; }
    if (!date) { showOKPopup("Find Date is required."); postingFoundItemReport = false; return; }

    const formData = new FormData();
    formData.append("finder", finder);
    formData.append("item", item);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("date", date);
    if (image1File) {
        const resized1 = await resizeImage(image1File);
        formData.append("image1", resized1);
    }
    if (image2File) {
        const resized2 = await resizeImage(image2File);
        formData.append("image1", resized2);
    }

    const result = await fetch(API + "/post_found.php", {
        method: "POST",
        body: formData
    });
    const response = await result.json();
    console.log(response);

    await showOKPopup("Thank you! Please drop off the item at the office to proceed.<br><br>Your report's ID is: " + response.found_report_id);
    window.location.href = "home.html";
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