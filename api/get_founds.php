<?php
header("Content-Type: application/json");

require_once __DIR__ . '/../conf/db.php';
require_once __DIR__ . '/../db/found_reports.php';

$conn = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
$data = json_decode(file_get_contents("php://input"), true);
$output = getFoundReports($conn, $data, $data['page']);

echo json_encode(["data" => $output]);
?>