import { API } from '../conf/api.js';
import { showOKPopup } from './popups.js';



export async function loadSelectOptions(selectionID, apiLink, columnName) {
    const categorySelect = document.getElementById(selectionID);

    // fetch options from server
    const result = await fetch(API + '/' + apiLink, {method: "POST"});
    const response = await result.json();
    console.log(response);

    if (!response.success) {
        showOKPopup("Failed to load options for: " + selectionID);
        return;
    }
    
    const data = response.data;

    for (let i = 0; i < data.length; i++) {
        const option = document.createElement("option");
        option.textContent = data[i][columnName];
        categorySelect.appendChild(option);
    }

    const option = document.createElement("option");
    option.textContent = "Other";
    categorySelect.appendChild(option);
}

