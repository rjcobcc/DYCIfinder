<?php
function getFoundReports($conn, $filters, $page = 1) {
    $limit = 9;
    $sql = "SELECT id, item_name, item_category, find_location, find_date FROM found_reports WHERE 1=1";
    $params = [];
    $types = "";
    if (!empty($filters['keyword'])) {
        $sql .= " AND (item_name LIKE ? OR item_category LIKE ?)";
        $keyword = "%" . $filters['keyword'] . "%";
        $params[] = $keyword;
        $params[] = $keyword;
        $types .= "ss";
    }
    if (!empty($filters['category']) && $filters['category'] !== 'Any') {
        $sql .= " AND item_category = ?";
        $params[] = $filters['category'];
        $types .= "s";
    }
    if (!empty($filters['location']) && $filters['location'] !== 'Anywhere') {
        $sql .= " AND find_location = ?";
        $params[] = $filters['location'];
        $types .= "s";
    }
    $page = max(1, (int)$page);
    $limit = max(1, (int)$limit);
    $offset = ($page - 1) * $limit;

    if ($filters['order'] == 'Oldest first') {
        $sql .= " ORDER BY find_date ASC LIMIT ? OFFSET ?"; 
    }
    else {
        $sql .= " ORDER BY find_date DESC LIMIT ? OFFSET ?";
    }

    $params[] = $limit;
    $params[] = $offset;
    $types .= "ii";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);

    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);

    $stmt->close();
    return $data;
}

function insertFoundReport(
    $conn,
    $finder_name,
    $item_name,
    $item_category,
    $item_description,
    $find_location,
    $find_date,
    $image_url1,
    $image_url2
) {
    $sql = "INSERT INTO found_reports 
        (item_name, item_category, item_description, find_location, find_date, image_url1, image_url2, finder_name) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "ssssssss",
        $item_name,
        $item_category,
        $item_description,
        $find_location,
        $find_date,
        $image_url1,
        $image_url2,
        $finder_name
    );

    $stmt->execute();
    $insertId = $stmt->insert_id;

    $stmt->close();
    return $insertId;
}

function getFoundReport($conn, $id) {
    $sql = "SELECT item_name, item_category, find_location, find_date FROM found_reports WHERE id = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $report = $result->fetch_assoc();
    $stmt->close();
    return $report;
}
?>