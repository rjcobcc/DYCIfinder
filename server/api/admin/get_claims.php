<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/foundreport_claims.php';
require_once __DIR__ . '/../../lib/util.php';

admin_block();

try {
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    $data = json_decode(file_get_contents("php://input"), true);
    $output = get_claims($conn, $data['foundID']);

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