<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../conf/db.php';
require_once __DIR__ . '/../db/item_categories.php';

try {
    $conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
    $output = get_itemcategory_names($conn);

    echo json_encode([
        "success" => true,
        "data" => $output
    ]);
}
catch (Exception $e) {
    error_log("Error in get_itemcategories.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "data" => []
    ]);
}