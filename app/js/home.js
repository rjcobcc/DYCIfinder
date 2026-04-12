import { API } from '../conf/api.js';

document.getElementById("prevPageButton").addEventListener("click",prevPage);
document.getElementById("nextPageButton").addEventListener("click",nextPage);
document.getElementById("searchButton").addEventListener("click",reloadFoundPostings);
document.getElementById("foundSomethingButton").addEventListener("click",reportFoundItem);

const orderSelection = document.getElementById("sortOptions");
const foundPostTemplate = document.getElementById("foundPostTemplate");
const foundPostsContainer = document.getElementById("foundPosts");

let page = 1;
let loadingFoundPostings = false;

reloadFoundPostings();

async function reloadFoundPostings() {
    if (loadingFoundPostings) {
        console.log("still processing last request");
        return;
    } 
    loadingFoundPostings = true;

    const keyword = document.getElementById("keywordInput").value.trim();
    const category = document.getElementById("categorySelection").value;
    const location = document.getElementById("locationSelection").value;
    const order = orderSelection.value;

    console.log(order);

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

    Array.from(foundPostsContainer.children).forEach(child => {
        if (child.tagName !== "TEMPLATE") {
            child.remove();
        }
    });

    for (let i = 0; i < data.length; i++) {
        let post = data[i];
        const clone = foundPostTemplate.content.cloneNode(true);
        clone.querySelector(".title").textContent = post['item_name'];
        clone.querySelector(".location").textContent = "Found at: " + post['location_found'];
        clone.querySelector(".date").textContent = "Found on: " + post['date_found'];
        clone.querySelector(".category").textContent = "Category: " + post['item_category'];
        clone.querySelector(".claimButton").addEventListener("click", function () {
            window.location.href = `post_claim.html?item_id=${post['id']}`;
        });
        foundPostsContainer.appendChild(clone);
    }
    
    loadingFoundPostings = false;
}

function reportFoundItem() {
    window.location.href = "post_found.html"
}

async function prevPage() {
    if (page === 1) {
        return;
    }
    page -= 1;
    reloadFoundPostings();
}

async function nextPage() {
    page += 1;
    reloadFoundPostings();
}