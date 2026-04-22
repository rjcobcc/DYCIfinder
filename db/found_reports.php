<?php

function getPublicFoundReports($conn, $page, $keyword, $category, $location, $order) {
    $limit = 9;
    $sql = "SELECT id, item_name, item_category, find_location, find_date FROM found_reports WHERE report_status = 'public'";
    $params = [];
    $types = "";
    if (!empty($keyword)) {
        $sql .= " AND (item_name LIKE ? OR item_category LIKE ?)";
        $keywordSQL = "%" . $keyword . "%";
        $params[] = $keywordSQL;
        $params[] = $keywordSQL;
        $types .= "ss";
    }
    if (!empty($category) && $category !== 'Any') {
        $sql .= " AND item_category = ?";
        $params[] = $category;
        $types .= "s";
    }
    if (!empty($location) && $location !== 'Anywhere') {
        $sql .= " AND find_location = ?";
        $params[] = $location;
        $types .= "s";
    }
    $page = max(1, (int)$page);
    $limit = max(1, (int)$limit);
    $offset = ($page - 1) * $limit;

    if ($order == 'Oldest first') {
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
    $user_id,
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
        (user_id, item_name, item_category, item_description, find_location, find_date, image_url1, image_url2, finder_name) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "issssssss",
        $user_id,
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



function getPublicFoundReport($conn, $id) {
    $sql = "SELECT item_name, item_category, find_location, find_date FROM found_reports WHERE id = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $report = $result->fetch_assoc();
    $stmt->close();
    return $report;
}