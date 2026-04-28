<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../conf/db.php';
require_once __DIR__ . '/../db/found_reports.php';

try {
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    $inputs = json_decode(file_get_contents("php://input"), true);
    $output = get_public_foundreport($conn, $inputs['id']);

    if ($output) {
        echo json_encode([
            "success" => true,
            "data" => $output
        ]);
        exit();
    }
}
catch (Exception $e) {
    error_log("Error in get_foundreport.php : " . $e->getMessage());
}
finally {
    echo json_encode([
        "success" => false,
        "data" => []
    ]);
}