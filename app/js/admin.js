import { popupConfirm, popupMessage } from '../lib/popups.js';
import { loadSelection } from '../lib/util.js';
import { API_URL } from '../conf/api.js';

let currentPage = 1;
let onLastPage = false;
let runningLoadFoundPosts = false;
let runningPublishReport = false;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("prev-pagebtn").addEventListener("click", goPrevPage);
    document.getElementById("next-pagebtn").addEventListener("click", goNextPage);
    document.getElementById("apply-filters-btn").addEventListener("click", loadFoundPosts);

    loadSelection("location-selection", "get_campuslocations.php", "location_name");
    loadSelection("category-selection", "get_itemcategories.php", "category_name");
    loadFoundPosts();
});



async function loadFoundPosts() {
    if (runningLoadFoundPosts) return;
    runningLoadFoundPosts = true;

    const foundPostsContainer = document.getElementById("found-reports-container");
    const foundPostTemplate = document.getElementById("foundpost-template");
    const keyword = document.getElementById("keyword-input").value.trim();
    const category = document.getElementById("category-selection").value;
    const location = document.getElementById("location-selection").value;
    const status = document.getElementById("status-selection").value;
    const order = document.getElementById("sort-options").value;

    let response;
    try {
        const result = await fetch(API_URL + '/admin/get_foundreports.php', {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                keyword, category, location, status, order, currentPage,
            })
        });
        response = await result.json();
        console.log(response);

        if (!response.success) throw new Error();
    }
    catch (error) {
        console.error(error);
        await popupMessage("Failed to load results.");
        runningLoadFoundPosts = false;
        return;
    }
    const data = response.data;

    if (data.length < 9) onLastPage = true;
    else onLastPage = false;

    Array.from(foundPostsContainer.children).forEach(child => {
        if (child.tagName !== "TEMPLATE") child.remove();
    });

    for (let i = 0; i < data.length; i++) {
        let post = data[i];
        const clone = foundPostTemplate.content.cloneNode(true);
        clone.querySelector(".item-image").src = post['image_url'];
        clone.querySelector(".foundpost-name").textContent = post['item_name'];
        clone.querySelector(".foundpost-location").textContent = post['find_location'];
        clone.querySelector(".foundpost-date").textContent = post['find_date'];
        clone.querySelector(".foundpost-category").textContent = post['item_category'];
        
        // Set status badge
        const statusBadge = clone.querySelector(".status-badge");
        const status = post['report_status'];
        let icon = "";
        let className = "";
        switch (status) {
            case "Pending":
                icon = "⏳";
                className = "pending";
                break;
            case "Unclaimed":
                icon = "✅";
                className = "unclaimed";
                break;
            case "To-claim":
                icon = "⚠️";
                className = "to-claim";
                break;
            case "Claimed":
                icon = "🎉";
                className = "claimed";
                break;
            default:
                icon = "❓";
                className = "pending";
        }
        statusBadge.textContent = `${icon} ${status}`;
        statusBadge.className = `post-badge status-badge ${className}`;
        
        clone.querySelector(".update-found-btn").addEventListener("click", function () {
            window.location.href = `found_report.html?id=${post['id']}`;
        });

        const publishBtn = clone.querySelector(".publish-found-btn")

        if (post['report_status'] != "Pending") {
            publishBtn.style.display = "none";
        }
        else {
            publishBtn.addEventListener("click", async function () {
                if (runningPublishReport) return;
                runningPublishReport = true;

                const confirmed = await popupConfirm("The office has received this item?");
                if (!confirmed) {
                    runningPublishReport = false;
                    return;
                }

                const result = await fetch(API_URL + '/admin/publish_foundreport.php', {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({ id: post['id'] })
                });
                const response = await result.json();
                console.log(response);

                if (response.success) {
                    publishBtn.style.display = "none";
                    await popupMessage("Successfully published report.");
                }
                else await popupMessage("Failed to publish report.");

                runningPublishReport = false;
            });
        }
        foundPostsContainer.appendChild(clone);
    }

    runningLoadFoundPosts = false;
}



async function goPrevPage() {
    if (currentPage == 1) return;
    currentPage -= 1;
    loadFoundPosts();
    document.getElementById("current-page").textContent = currentPage;
}



async function goNextPage() {
    if (onLastPage) return;
    currentPage += 1;
    loadFoundPosts();
    document.getElementById("current-page").textContent = currentPage;
}

