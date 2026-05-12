import { popupConfirm, popupMessage } from '../lib/popups.js';
import { API_URL } from '../conf/api.js';

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('open-browser-btn').addEventListener('click', function () {
        window.location.href = 'admin.html';
    });

    document.getElementById('add-location-btn').addEventListener('click', addLocation);
    document.getElementById('add-category-btn').addEventListener('click', addCategory);

    loadLatestReports();
    loadCampusLocations();
    loadItemCategories();
});

async function fetchJson(path, body = null) {
    const result = await fetch(API_URL + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : null
    });
    return await result.json();
}

async function loadLatestReports() {
    const container = document.getElementById('dashboard-reports-container');
    const template = document.getElementById('dashboard-report-template');

    let response;
    try {
        response = await fetchJson('/admin/get_latest_foundreports.php');
        if (!response.success) throw new Error();
    }
    catch (error) {
        console.error(error);
        await popupMessage('Unable to load latest found reports.');
        return;
    }

    container.innerHTML = '';
    const reports = response.data || [];

    if (reports.length === 0) {
        container.innerHTML = '<p class="text-muted">No recent reports available.</p>';
        return;
    }

    reports.forEach((report) => {
        const clone = template.content.cloneNode(true);
        const imageUrl = report.image_url && report.image_url.trim() ? report.image_url : 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22270%22 viewBox=%220 0 400 270%22%3E%3Crect width=%22400%22 height=%22270%22 fill=%22%23ececec%22/%3E%3Ctext x=%2220%22 y=%22145%22 fill=%22%23666%22 font-family=%22Segoe UI%22 font-size=%2220%22%3ENo image available%3C/text%3E%3C/svg%3E';
        clone.querySelector('.report-image').src = imageUrl;
        clone.querySelector('.dashboard-card-title').textContent = report.item_name;
        clone.querySelector('.dashboard-card-subtitle').textContent = report.item_category;
        clone.querySelector('.report-status').textContent = report.report_status;
        clone.querySelector('.report-location').textContent = report.find_location;
        clone.querySelector('.report-date').textContent = report.find_date;
        clone.querySelector('.btn-view').addEventListener('click', () => {
            window.location.href = `found_report.html?id=${report.id}`;
        });
        container.appendChild(clone);
    });
}

async function loadCampusLocations() {
    const body = document.getElementById('locations-table-body');

    let response;
    try {
        response = await fetchJson('/admin/get_campuslocations.php');
        if (!response.success) throw new Error();
    }
    catch (error) {
        console.error(error);
        await popupMessage('Unable to load campus location list.');
        return;
    }

    body.innerHTML = '';
    const rows = response.data || [];

    if (rows.length === 0) {
        body.innerHTML = '<tr><td colspan="2" class="text-muted">No campus locations found.</td></tr>';
        return;
    }

    rows.forEach((row) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.location_name}</td>
            <td><button class="remove-btn" data-id="${row.id}">Remove</button></td>
        `;
        tr.querySelector('.remove-btn').addEventListener('click', async () => {
            const confirmed = await popupConfirm(`Delete location \"${row.location_name}\"?`);
            if (!confirmed) return;
            await deleteLocation(row.id);
        });
        body.appendChild(tr);
    });
}

async function loadItemCategories() {
    const body = document.getElementById('categories-table-body');

    let response;
    try {
        response = await fetchJson('/admin/get_itemcategories.php');
        if (!response.success) throw new Error();
    }
    catch (error) {
        console.error(error);
        await popupMessage('Unable to load item category list.');
        return;
    }

    body.innerHTML = '';
    const rows = response.data || [];

    if (rows.length === 0) {
        body.innerHTML = '<tr><td colspan="2" class="text-muted">No item categories found.</td></tr>';
        return;
    }

    rows.forEach((row) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.category_name}</td>
            <td><button class="remove-btn" data-id="${row.id}">Remove</button></td>
        `;
        tr.querySelector('.remove-btn').addEventListener('click', async () => {
            const confirmed = await popupConfirm(`Delete category \"${row.category_name}\"?`);
            if (!confirmed) return;
            await deleteCategory(row.id);
        });
        body.appendChild(tr);
    });
}

async function addLocation() {
    const input = document.getElementById('location-add-input');
    const value = input.value.trim();
    if (!value) {
        await popupMessage('Enter a location name before adding.');
        return;
    }

    let response;
    try {
        response = await fetchJson('/admin/add_campuslocation.php', { location_name: value });
        if (!response.success) throw new Error(response.message || 'Failed');
    }
    catch (error) {
        console.error(error);
        await popupMessage(response?.message || 'Unable to add campus location.');
        return;
    }

    input.value = '';
    await loadCampusLocations();
}

async function addCategory() {
    const input = document.getElementById('category-add-input');
    const value = input.value.trim();
    if (!value) {
        await popupMessage('Enter a category name before adding.');
        return;
    }

    let response;
    try {
        response = await fetchJson('/admin/add_itemcategory.php', { category_name: value });
        if (!response.success) throw new Error(response.message || 'Failed');
    }
    catch (error) {
        console.error(error);
        await popupMessage(response?.message || 'Unable to add item category.');
        return;
    }

    input.value = '';
    await loadItemCategories();
}

async function deleteLocation(id) {
    const response = await fetchJson('/admin/delete_campuslocation.php', { id });
    if (!response.success) {
        await popupMessage(response.message || 'Could not remove location.');
        return;
    }
    await loadCampusLocations();
}

async function deleteCategory(id) {
    const response = await fetchJson('/admin/delete_itemcategory.php', { id });
    if (!response.success) {
        await popupMessage(response.message || 'Could not remove category.');
        return;
    }
    await loadItemCategories();
}
