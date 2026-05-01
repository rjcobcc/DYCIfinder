import { API_URL } from '../conf/api.js';
import { popupMessage } from './popups.js';



export async function loadSelection(selectionID, apiLink, columnName) {
    const categorySelect = document.getElementById(selectionID);

    const result = await fetch(API_URL + '/' + apiLink, {method: "POST"});
    const response = await result.json();
    console.log(response);
    
    const optionOther = document.createElement("option");
    optionOther.textContent = "N/A";
    categorySelect.appendChild(optionOther);

    if (!response.success) {
        popupMessage("Failed to fetch options for: " + selectionID);
        return;
    }
    
    const data = response.data;

    for (let i = 0; i < data.length; i++) {
        const option = document.createElement("option");
        option.textContent = data[i][columnName];
        categorySelect.appendChild(option);
    }
}

