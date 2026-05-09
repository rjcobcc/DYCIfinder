<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/users.php';

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $inputs = json_decode(file_get_contents("php://input"), true);

    $password = $inputs['password'];
    $email = $inputs['email'];
    $code = $inputs['code'];

    $user = get_user_by_email($conn, $email);
    $validCode = get_valid_user_code($conn, $email);

    if (!$validCode) {
        echo json_encode([
            "success" => false,
            "message" => "Code Not Found"
        ]);
        exit();
    }
    elseif($code != $validCode) {
        echo json_encode([
            "success" => false,
            "message" => "Incorrect Code"
        ]);
        exit();
    }
    elseif (edit_user_attribute($conn, $user['id'], "hashed_pass", password_hash($password, PASSWORD_DEFAULT))) {
        echo json_encode([
            "success" => true,
            "message" => "User Registered"
        ]);
        exit();
    }
}
catch (Exception $e) {
    error_log("Error in register.php : " . $e->getMessage());
}
finally {
    echo json_encode([
        "success" => false,
        "message" => "Error Occured"
    ]);
}