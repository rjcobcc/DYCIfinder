<?php
header("Content-Type: application/json");
session_start();

require_once(__DIR__ . '/../../conf/db.php');
require_once(__DIR__ . '/../../db/users.php');

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    $user = get_user($conn, $_SESSION['userID'] ?? 0);

    echo json_encode([
        "success" => true,
        "data" => [
            "id" => $_SESSION['userID'] ?? 0,
            "isAdmin" => $_SESSION['isAdmin'] ?? false,
            "user" => $user
        ]
    ]);
}
catch (Exception $e) {
    error_log("Error in get_user_info.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "data" => []
    ]);
}