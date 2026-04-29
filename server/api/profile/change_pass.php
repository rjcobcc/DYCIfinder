<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/users.php';

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $inputs = json_decode(file_get_contents("php://input"), true);

    if (!isset($_SESSION['userID'])) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid Session"
        ]);
        exit();
    }

    $currentPass = $inputs['current_password'];
    $newPass = $inputs['new_password'];
    $hashedPass = get_user_by_id($conn, $_SESSION['userID'])['hashed_pass'];

    if (password_verify($currentPass, $hashedPass)) {
        if (edit_user_attribute($conn, $_SESSION['userID'], "hashed_pass", password_hash($newPass, PASSWORD_DEFAULT))) {
            echo json_encode([
                "success" => true,
                "message" => "Password Changed"
            ]);
            exit();
        }
        else throw new Exception();
    }
    else {
        echo json_encode([
            "success" => false,
            "message" => "Incorrect Password"
        ]);
        exit();
    }
}
catch (Exception $e) {
    error_log("Error in change_pass.php : " . $e->getMessage());
}
finally {
    echo json_encode([
        "success" => false,
        "message" => "Error Occured"
    ]);
}