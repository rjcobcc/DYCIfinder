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
    $id = isset($data['id']) ? intval($data['id']) : 0;

    if ($id <= 0) {
        echo json_encode(["success" => false, "message" => "Invalid location ID.", "data" => []]);
        exit();
    }

    $success = delete_campuslocation($conn, $id);
    if (!$success) {
        echo json_encode(["success" => false, "message" => "Could not remove location.", "data" => []]);
        exit();
    }

    echo json_encode(["success" => true, "data" => []]);
}
catch (Exception $e) {
    error_log("Error in delete_campuslocation.php : " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Error deleting location.", "data" => []]);
}
