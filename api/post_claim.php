<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../conf/db.php';
require_once __DIR__ . '/../db/item_claims.php';
require_once __DIR__ . '/../lib/img_host.php';

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

$image1Url = uploadAndGetImageURL($_FILES['image1']['tmp_name'] ?? null);
$image2Url = uploadAndGetImageURL($_FILES['image2']['tmp_name'] ?? null);

$data = $_POST;
$data['image1'] = $image1Url;
$data['image2'] = $image2Url;

$output = insertItemClaim($conn, $data);

echo json_encode([
    "success" => $output != -1,
    "insert_id" => $output,
]);
?>