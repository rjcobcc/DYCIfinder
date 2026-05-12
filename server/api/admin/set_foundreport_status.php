<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/found_reports.php';
require_once __DIR__ . '/../../lib/util.php';

admin_block();

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $inputs = json_decode(file_get_contents("php://input"), true);

    $success = set_report_status($conn, $inputs['id'], $inputs['status']);
    if ($success) {
        echo json_encode([
            "success" => true
        ]);
        exit();
    }
} 
catch (Exception $e) {
    error_log("Error in update_user.php : " . $e->getMessage());
} finally {
    echo json_encode([
        "success" => false
    ]);
}