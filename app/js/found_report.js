import { API_URL } from '../conf/api.js';
import { popupLoading, popupMessage } from '../lib/popups.js';
import { loadSelection } from '../lib/util.js';
import { replaceImage } from '../lib/img_preview.js';
import { getResizedImage } from '../lib/img_resizer.js';

const foundReportID = new URLSearchParams(window.location.search).get('id');

let runningLoadFoundReportInfo = false;
let runningUpdateFoundReport = false;
let runningSaveNewImage = false;
let foundReportImageSRC = "";

document.addEventListener("DOMContentLoaded", async function () {
    if (foundReportID == null || foundReportID == "") window.location.href = "admin.html";

    loadSelection("found-location-select", "get_campuslocations.php", "location_name");
    loadSelection("found-category-select", "get_itemcategories.php", "category_name");
    await loadFoundReportInfo(); 
    
    document.getElementById("found-update-btn").addEventListener("click", updateFoundReport);
    document.getElementById("foundpost-image").addEventListener("change", function () { replaceImage(this, "found-image", foundReportImageSRC); })
    document.getElementById("upload-image").addEventListener("click", saveNewImage)
});



async function loadFoundReportInfo() {
    if (runningLoadFoundReportInfo) return;
    runningLoadFoundReportInfo = true;

    const itemNameInput = document.getElementById("found-item-name");
    const categorySelect = document.getElementById("found-category-select");
    const descriptionInput = document.getElementById("found-item-desc");
    const locationSelect = document.getElementById("found-location-select");
    const findDateInput = document.getElementById("found-find-date");
    const previewImage = document.getElementById("found-image");
    const finderNameInput = document.getElementById("found-finder-name");
    const studentIdInput = document.getElementById("found-finder-student-id");
    const courseSectionInput = document.getElementById("found-finder-course-section");
    const fbInput = document.getElementById("found-finder-fb");
    const phoneInput = document.getElementById("found-finder-phone");
    const emailInput = document.getElementById("found-finder-email");

    let data;
    try {
        const result = await fetch(API_URL + "/admin/get_foundreport.php", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                id: foundReportID
            })
        });
        const response = await result.json();
        console.log(response);
        data = response.data;

        if (!response.success) {
            window.location.href = "admin.html";
        } 
    }
    catch (error) {
        console.error(error);
        window.location.href = "admin.html";
    }
    
    itemNameInput.value = data.item_name;
    categorySelect.value = data.item_category;
    descriptionInput.value = data.item_desc;
    locationSelect.value = data.find_location;
    findDateInput.value = data.find_date;
    previewImage.src = data.image_url;
    foundReportImageSRC = data.image_url;
    finderNameInput.value = data.finder_full_name;
    studentIdInput.value = data.finder_student_id;
    courseSectionInput.value = data.finder_course_section;
    fbInput.value = data.finder_fb;
    phoneInput.value = data.finder_phone;
    emailInput.value = data.finder_email;

    runningLoadFoundReportInfo = false;
}



async function updateFoundReport() {
    if (runningUpdateFoundReport) return;
    runningUpdateFoundReport = true;

    const itemNameInput = document.getElementById("found-item-name").value.trim();
    const categorySelect = document.getElementById("found-category-select").value.trim();
    const descriptionInput = document.getElementById("found-item-desc").value.trim();
    const locationSelect = document.getElementById("found-location-select").value.trim();
    const findDateInput = document.getElementById("found-find-date").value;
    const finderNameInput = document.getElementById("found-finder-name").value.trim();
    const studentIdInput = document.getElementById("found-finder-student-id").value.trim();
    const courseSectionInput = document.getElementById("found-finder-course-section").value.trim();
    const fbInput = document.getElementById("found-finder-fb").value.trim();
    const phoneInput = document.getElementById("found-finder-phone").value.trim();
    const emailInput = document.getElementById("found-finder-email").value.trim();

    const formData = new FormData();
    formData.append("item_name", itemNameInput);
    formData.append("item_category", categorySelect);
    formData.append("item_desc", descriptionInput);
    formData.append("find_location", locationSelect);
    formData.append("find_date", findDateInput);
    formData.append("finder_full_name", finderNameInput);
    formData.append("finder_student_id", studentIdInput);
    formData.append("finder_course_section", courseSectionInput);
    formData.append("finder_fb", fbInput);
    formData.append("finder_phone", phoneInput);
    formData.append("finder_email", emailInput);
    formData.append("item_id", foundReportID);

    try {
        const result = await fetch(API_URL + "/admin/update_foundreport.php", {
            method: "POST",
            body: formData
        });
        const response = await result.json();
        console.log(response);

        if (response.success) {
            await popupMessage("Successfully updated found report.");
        } 
        else throw new Error();
    }
    catch (error) {
        console.error(error);
        await popupMessage("Error updating found report.<br>Please try again.");
    }
    finally {
        runningUpdateFoundReport = false;
    }
}



async function saveNewImage() {
    if (runningSaveNewImage) return;
    runningSaveNewImage = true;
    
    popupLoading();

    const imageFile = document.getElementById("foundpost-image").files[0];

    if (!imageFile) {
        popupMessage("Please select an image to upload.");
        runningSaveNewImage = false;
        return;
    }

    const formData = new FormData();
    const resizedImage = await getResizedImage(imageFile);
    formData.append("image", resizedImage);
    formData.append("reportID", foundReportID);

    try {
        const result = await fetch(API_URL + "/admin/newimage_foundreport.php", {
            method: "POST",
            body: formData
        });
        const response = await result.json();
        console.log(response);

        if (response.success) {
            await popupMessage("Successfully updated found report image.");
        } 
        else throw new Error();
    }
    catch (error) {
        console.error(error);
        await popupMessage("Error updating found report image.<br>Please try again.");
    }
    finally {
        runningSaveNewImage = false;
    }
}