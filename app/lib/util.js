import { API } from '../conf/api.js';



export async function loadSelectOptions(selectionID, apiLink, columnName) {
    const categorySelect = document.getElementById(selectionID);
    const result = await fetch(API + '/' + apiLink, {method: "POST"});
    const response = await result.json();
    const data = response.data;
    console.log(data);

    for (let i = 0; i < data.length; i++) {
        const option = document.createElement("option");
        option.textContent = data[i][columnName];
        categorySelect.appendChild(option);
    }
    const option = document.createElement("option");
    option.textContent = "Other";
    categorySelect.appendChild(option);
}

