import { API_URL } from '../conf/api.js';
import { getResizedImage } from '../lib/img_resizer.js';
import { popupMessage } from '../lib/popups.js';
import { loadSelection } from '../lib/util.js';
import { clearImage, previewImage } from '../lib/img_preview.js';

let runningPostFoundReport = false;

loadSelection("foundpost-itemcategory", "get_itemcategories.php", "category_name");
loadSelection("foundpost-findlocation", "get_campuslocations.php", "location_name");

document.getElementById("submit-foundpost-btn").addEventListener("click", postFoundReport)
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("foundpost-image").addEventListener("change", function () { previewImage(this, "preview-image", "remove-image"); });
    document.getElementById("remove-image").addEventListener("click", function () { clearImage("foundpost-image", "preview-image", "remove-image"); });
});



async function postFoundReport() {
    if (runningPostFoundReport) 
        return;
    runningPostFoundReport = true;

    const finder = document.getElementById("foundpost-findername").value.trim();
    const item = document.getElementById("foundpost-itemname").value.trim(); 
    const category = document.getElementById("foundpost-itemcategory").value.trim(); 
    const description = document.getElementById("foundpost-description").value.trim(); 
    const location = document.getElementById("foundpost-findlocation").value.trim(); 
    const date = document.getElementById("foundpost-finddate").value;
    const imageFile = document.getElementById("foundpost-image").files[0];

    let invalidMessage = null;
    if (!finder) 
        invalidMessage = "Finder name is required."; 
    else if (!item) 
        invalidMessage = "Item name is required.";  
    else if (!category) 
        invalidMessage = "Item Category is required."; 
    else if (!description) 
        invalidMessage = "Item Description is required."; 
    else if (!location) 
        invalidMessage = "Find Location is required."; 
    else if (!date) 
        invalidMessage = "Find Date is required.";  
    else if (!imageFile) 
        invalidMessage = "Item Photo is required."; 

    if (invalidMessage) {
        await popupMessage(invalidMessage);

        runningPostFoundReport = false;
        return;
    }

    const resized = await getResizedImage(imageFile);
    const formData = new FormData();
    formData.append("finder", finder);
    formData.append("item", item);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("image", resized);

    try {
        const result = await fetch(API_URL + "/post_foundreport.php", {
            method: "POST",
            body: formData
        });
        const response = await result.json();
        console.log(response)

        if (response.success) {
            await popupMessage("Thank you! Please drop off the item at the office to proceed.<br><br>Your report's ID is: " + response.data['found_report_id']);
            window.location.href = "search_found.html";
        }
        else 
            throw new Error();
    }
    catch (e) {
        console.log(e);
        await popupMessage("An error occurred.<br><br>Please try again.");

        runningPostFoundReport = false; 
        return;
    }
}