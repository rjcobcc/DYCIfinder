<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/campus_locations.php';
require_once __DIR__ . '/../../lib/util.php';

admin_block();

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $data = json_decode(file_get_contents('php://input'), true);
    $location_name = trim($data['location_name'] ?? '');

    if ($location_name === '') {
        echo json_encode(["success" => false, "message" => "Location name is required.", "data" => []]);
        exit();
    }

    $success = insert_campuslocation($conn, $location_name);
    if (!$success) {
        echo json_encode(["success" => false, "message" => "Could not add location.", "data" => []]);
        exit();
    }

    echo json_encode(["success" => true, "data" => []]);
}
catch (Exception $e) {
    error_log("Error in add_campuslocation.php : " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Error adding location.", "data" => []]);
}
