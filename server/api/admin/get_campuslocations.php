<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/campus_locations.php';
require_once __DIR__ . '/../../lib/util.php';

admin_block();

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $output = get_campuslocations($conn);

    echo json_encode([
        "success" => true,
        "data" => $output
    ]);
}
catch (Exception $e) {
    error_log("Error in get_campuslocations.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "data" => []
    ]);
}
