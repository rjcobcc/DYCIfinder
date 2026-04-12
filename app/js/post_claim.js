import { API } from '../conf/api.js';
import { showOKPopup } from '../lib/popups.js';
import { resizeImage } from '../lib/img_resizer.js';

document.getElementById("submitClaimButton").addEventListener("click",submitClaim);
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("image1").addEventListener("change", function() {
        previewImage(this, "preview1");
    });
    document.getElementById("image2").addEventListener("change", function() {
        previewImage(this, "preview2");
    });
});

const params = new URLSearchParams(window.location.search);
const item_id = params.get("item_id");

let submittingClaim = false;

loadItemDetails();

async function submitClaim() {
    if (submittingClaim) return;
    submittingClaim = true
    const description = document.getElementById("claimDescription").value.trim();
    const name = document.getElementById("claimantName").value.trim();
    const fbProfile = document.getElementById("fbProfile").value.trim();
    const contactno = document.getElementById("contactno").value.trim();
    const email = document.getElementById("email").value.trim();
    const contactinfo = document.getElementById("contactinfo").value.trim();
    const image1File = document.getElementById("image1").files[0];
    const image2File = document.getElementById("image2").files[0];

    const formData = new FormData();
    formData.append("item_id", item_id);
    formData.append("description", description);
    formData.append("name", name);
    formData.append("fbProfile", fbProfile);
    formData.append("contactno", contactno);
    formData.append("email", email);
    formData.append("contactinfo", contactinfo);

    if (image1File) {
        const resized1 = await resizeImage(image1File, 1024, 1024, 0.8);
        formData.append("image1", new File([resized1], "image1.jpg", { type: "image/jpeg" }));
    }
    if (image2File) {
        const resized2 = await resizeImage(image2File, 1024, 1024, 0.8);
        formData.append("image2", new File([resized2], "image2.jpg", { type: "image/jpeg" }));
    }

    const result = await fetch(API + "/post_claim.php", {
        method: "POST",
        body: formData
    });
    const response = await result.json();
    console.log(response);

    submittingClaim = false;
    await showOKPopup("Claim successfully submitted!<br>We will contact you through your given contact information.");
    window.location.href = "home.html";
}

async function loadItemDetails() {
    const result = await fetch(API + '/get_found.php', {
        method: "POST",
        headers: {
            "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
            item_id
        })
    });
    const response = await result.json();
    const data = response.data;
    console.log(data);

    document.getElementById("itemName").textContent = data['item_name'];
    document.getElementById("itemCategory").textContent = "Category: " + data['item_category'];
    document.getElementById("itemFoundLocation").textContent = "Found at: " + data['location_found'];
    document.getElementById("itemFoundDate").textContent = "Found on: " + data['date_found'];
}

function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(input.files[0]);
    }
}