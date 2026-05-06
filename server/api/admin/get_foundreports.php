<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/found_reports.php';

try {
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    $data = json_decode(file_get_contents("php://input"), true);
    $output = get_foundreports($conn, $data['currentPage'], $data['keyword'], $data['category'], $data['location'], $data['order']);

    echo json_encode([
        "success" => true,
        "data" => $output
    ]);
}
catch (Exception $e) {
    error_log("Error in get_foundreports.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "data" => []
    ]);
}