<?php

function get_public_foundreports($conn, $page, $keyword, $category, $location, $order) { // returns [] or [['id' => int, 'item_name' => string, ...], ...]
    $pageLimit = 9;
    $sql = "SELECT id, item_name, item_category, find_location, find_date FROM found_reports WHERE report_status = 'Unclaimed'";
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
    
    if ($order == 'Oldest first') {
        $sql .= " ORDER BY find_date ASC LIMIT ? OFFSET ?"; 
    }
    else {
        $sql .= " ORDER BY find_date DESC LIMIT ? OFFSET ?";
    }

    $page = max(1, (int)$page);
    $offset = ($page - 1) * $pageLimit;
    $params[] = $pageLimit;
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



function insert_foundreport( // returns int (inserted row ID) or 0 if insert failed
    $conn,
    $user_id,
    $finder_name,
    $item_name,
    $item_category,
    $item_description,
    $find_location,
    $find_date,
    $image_url
) {
    $sql = "INSERT INTO found_reports 
        (user_id, item_name, item_category, item_description, find_location, find_date, image_url, finder_name) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "isssssss",
        $user_id,
        $item_name,
        $item_category,
        $item_description,
        $find_location,
        $find_date,
        $image_url,
        $finder_name
    );

    $stmt->execute();
    $insertId = $stmt->insert_id;

    $stmt->close();
    return $insertId; 
}



function get_public_foundreport($conn, $id) { // returns null or ['item_name' => string, 'item_category' => string, ...]
    $stmt = $conn->prepare("SELECT item_name, item_category, find_location, find_date FROM found_reports WHERE id = ? AND report_status = 'Unclaimed' LIMIT 1");
    $stmt->bind_param("i", $id);

    $stmt->execute();
    $result = $stmt->get_result();
    $report = $result->fetch_assoc();

    $stmt->close();
    return $report;
}