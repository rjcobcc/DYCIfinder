<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/item_categories.php';
require_once __DIR__ . '/../../lib/util.php';

admin_block();

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $data = json_decode(file_get_contents('php://input'), true);
    $category_name = trim($data['category_name'] ?? '');

    if ($category_name === '') {
        echo json_encode(["success" => false, "message" => "Category name is required.", "data" => []]);
        exit();
    }

    $success = insert_itemcategory($conn, $category_name);
    if (!$success) {
        echo json_encode(["success" => false, "message" => "Could not add category.", "data" => []]);
        exit();
    }

    echo json_encode(["success" => true, "data" => []]);
}
catch (Exception $e) {
    error_log("Error in add_itemcategory.php : " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Error adding category.", "data" => []]);
}
