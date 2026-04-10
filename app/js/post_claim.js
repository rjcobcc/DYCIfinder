import { API } from '../conf/api.js';

document.getElementById("submitClaimButton").addEventListener("click",submitClaim);

async function submitClaim() {
    const params = new URLSearchParams(window.location.search);
    const item_id = params.get("item_id"); 
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

    if (response.success) {
        window.location.href = "home.html";
    }
}