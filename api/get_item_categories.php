<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../conf/db.php';
require_once __DIR__ . '/../db/item_categories.php';

$conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
$output = getItemCategories($conn);

echo json_encode(["data" => $output]);
?>