<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../conf/db.php';
require_once __DIR__ . '/../db/item_claims.php';

$conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
$data = json_decode(file_get_contents("php://input"), true);
$output = insertItemClaim($conn, $data);

echo json_encode([
    "success" => $output != -1,
    "insert_id" => $output
]);
?>