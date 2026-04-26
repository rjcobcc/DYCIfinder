<?php

header("Content-Type: application/json");

require_once __DIR__ . '/../conf/db.php';
require_once __DIR__ . '/../db/campus_locations.php';

try {
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    $output = getCampusLocationNames($conn);

    echo json_encode([
        "success" => true,
        "data" => $output
    ]);
}
catch (Exception $e) {
    error_log("Error get_campus_locations.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "data" => []
    ]);
}