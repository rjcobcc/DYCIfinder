import { API } from '../conf/api.js';
import { showOKPopup } from './popup.js';

document.getElementById("submitClaimButton").addEventListener("click",submitClaim);

const params = new URLSearchParams(window.location.search);
const item_id = params.get("item_id"); 

loadItemDetails();

async function submitClaim() {
    const description = document.getElementById("claimDescription").value.trim();
    const name = document.getElementById("claimantName").value.trim();
    const fbProfile = document.getElementById("fbProfile").value.trim();
    const contactno = document.getElementById("contactno").value.trim();
    const email = document.getElementById("email").value.trim();
    const contactinfo = document.getElementById("contactinfo").value.trim();

    const result = await fetch(API + '/post_claim.php', {
        method: "POST",
        headers: {
            "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
            item_id, description, name, fbProfile, contactno, email, contactinfo
        })
    });
    const response = await result.json();
    console.log(response);

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

    document.getElementById("itemName").textContent = "Item for Claim: " + data['item_name'];
    document.getElementById("itemCategory").textContent = "Category: " + data['item_category'];
    document.getElementById("itemFoundLocation").textContent = "Found at: " + data['location_found'];
    document.getElementById("itemFoundDate").textContent = "Found on: " + data['date_found'];
}