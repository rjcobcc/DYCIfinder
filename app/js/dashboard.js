import { popupConfirm, popupMessage } from '../lib/popups.js';
import { API_URL } from '../conf/api.js';

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('open-browser-btn').addEventListener('click', function () {
        window.location.href = 'admin.html';
    });

    document.getElementById('export-foundreports-btn').addEventListener('click', exportFoundReportsPDF);
    document.getElementById('export-claims-btn').addEventListener('click', exportClaimsPDF);
    document.getElementById('export-lostreports-btn').addEventListener('click', exportLostReportsPDF);
    document.getElementById('add-location-btn').addEventListener('click', addLocation);
    document.getElementById('add-category-btn').addEventListener('click', addCategory);

    loadLatestReports();
    loadCampusLocations();
    loadItemCategories();
});

async function exportFoundReportsPDF() {
    const button = document.getElementById('export-foundreports-btn');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Preparing Found Reports...';

    try {
        const reports = await fetchAllFoundReports();
        if (!reports.length) {
            await popupMessage('No found reports are available for export.');
            return;
        }

        await createPDF(
            'Found Reports',
            'dycifinder_found_reports.pdf',
            ['ID', 'Item Name', 'Category', 'Location', 'Date', 'Status'],
            reports.map((item) => [
                item.id,
                item.item_name,
                item.item_category,
                item.find_location,
                item.find_date,
                item.report_status
            ])
        );
    }
    catch (error) {
        console.error(error);
        await popupMessage('Unable to export found reports.');
    }
    finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}

async function exportClaimsPDF() {
    const button = document.getElementById('export-claims-btn');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Preparing Claims...';

    try {
        const claims = await fetchAllClaims();
        if (!claims.length) {
            await popupMessage('No claims are available for export.');
            return;
        }

        await createPDF(
            'Found Report Claims',
            'dycifinder_claims.pdf',
            ['Claim ID', 'Found Report ID', 'Item Name', 'Claimant', 'Status', 'Contact', 'Claim Description'],
            claims.map((claim) => [
                claim.id,
                claim.foundreport_id,
                claim.item_name || 'N/A',
                claim.owner_full_name || 'N/A',
                claim.claim_status || 'N/A',
                claim.owner_phone || claim.owner_email || 'N/A',
                claim.claim_desc || 'N/A'
            ])
        );
    }
    catch (error) {
        console.error(error);
        await popupMessage('Unable to export claims.');
    }
    finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}

async function exportLostReportsPDF() {
    const button = document.getElementById('export-lostreports-btn');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Preparing Lost Reports...';

    try {
        const reports = await fetchAllLostReports();
        if (!reports.length) {
            await popupMessage('No lost reports are available for export.');
            return;
        }

        await createPDF(
            'Lost Reports',
            'dycifinder_lost_reports.pdf',
            ['ID', 'Item Name', 'Category', 'Location', 'Date', 'Status'],
            reports.map((item) => [
                item.id,
                item.item_name,
                item.item_category,
                item.lost_location,
                item.lost_date,
                item.report_status
            ])
        );
    }
    catch (error) {
        console.error(error);
        await popupMessage('Unable to export lost reports.');
    }
    finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}

async function createPDF(title, filename, head, body) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const margin = 40;
    let cursorY = 40;

    doc.setFontSize(18);
    doc.text('DYCIfinder Export', margin, cursorY);
    cursorY += 24;
    doc.setFontSize(10);
    doc.text(`Table: ${title}`, margin, cursorY);
    cursorY += 18;
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, cursorY);
    cursorY += 24;

    doc.autoTable({
        startY: cursorY,
        margin: { left: margin, right: margin },
        head: [head],
        body,
        styles: { fontSize: 8, cellPadding: 4, overflow: 'linebreak' },
        headStyles: { fillColor: [40, 116, 240] },
        theme: 'grid'
    });

    doc.save(filename);
}

async function fetchAllFoundReports() {
    const response = await fetchJson('/admin/get_all_foundreports.php', {});
    if (!response.success) {
        throw new Error('Failed to load found reports');
    }
    return response.data || [];
}

async function fetchAllLostReports() {
    const response = await fetchJson('/admin/get_all_losts.php', {});
    if (!response.success) {
        throw new Error('Failed to load lost reports');
    }
    return response.data || [];
}

async function fetchAllClaims() {
    const response = await fetchJson('/admin/get_all_claims.php', {});
    if (!response.success) {
        throw new Error('Failed to load claims');
    }
    return response.data || [];
}

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
