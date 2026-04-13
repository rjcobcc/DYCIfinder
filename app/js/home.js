import { API } from '../conf/api.js';
import { loadSelectOptions } from '../lib/util.js';

document.getElementById("prevPageButton").addEventListener("click",prevPage);
document.getElementById("nextPageButton").addEventListener("click",nextPage);
document.getElementById("searchButton").addEventListener("click",reloadFoundPostings);

const pageNumber = document.getElementById("pageNumber");

let page = 1;
let lastPage = false;
let loadingFoundPostings = false;

loadSelectOptions("categorySelection", "get_item_categories.php", "category_name");
loadSelectOptions("locationSelection", "get_campus_locations.php", "location_name");
reloadFoundPostings();



async function reloadFoundPostings() {
    if (loadingFoundPostings) return;
    loadingFoundPostings = true;

    const foundPostsContainer = document.getElementById("foundPosts");
    const foundPostTemplate = document.getElementById("foundPostTemplate");
    const order = document.getElementById("sortOptions").value;
    const keyword = document.getElementById("keywordInput").value.trim();
    const category = document.getElementById("categorySelection").value;
    const location = document.getElementById("locationSelection").value;

    const result = await fetch(API + '/get_founds.php', {
        method: "POST",
        headers: {
            "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
            keyword, category, location, order, page, 
        })
    });
    const response = await result.json();
    const data = response.data;
    console.log(data);

    if (data.length < 9) lastPage = true;
    else lastPage = false;

    // clear old results
    Array.from(foundPostsContainer.children).forEach(child => {
        if (child.tagName !== "TEMPLATE") {
            child.remove();
        }
    });

    // load new results
    for (let i = 0; i < data.length; i++) {
        let post = data[i];
        const clone = foundPostTemplate.content.cloneNode(true);
        clone.querySelector(".name").textContent = post['item_name'];
        clone.querySelector(".location").textContent = "Found at: " + post['find_location'];
        clone.querySelector(".date").textContent = "Found on: " + post['find_date'];
        clone.querySelector(".category").textContent = "Category: " + post['item_category'];
        clone.querySelector(".claimButton").addEventListener("click", function () {
            window.location.href = `post_claim.html?item_id=${post['id']}`;
        });
        foundPostsContainer.appendChild(clone);
    }
    
    loadingFoundPostings = false;
}



async function prevPage() {
    if (page === 1) return;
    page -= 1;
    reloadFoundPostings();
    pageNumber.textContent = "Page " + page;
}



async function nextPage() {
    if (lastPage) return;
    page += 1;
    reloadFoundPostings();
    pageNumber.textContent = "Page " + page;
}