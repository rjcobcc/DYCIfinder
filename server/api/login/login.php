<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/users.php';

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $inputs = json_decode(file_get_contents("php://input"), true);

    $email = $inputs['email'];
    $password = $inputs['password'];
    $hashedPass = get_user_hashedpass($conn, $email);

    if (!$hashedPass) {
        echo json_encode([
            "success" => false,
            'data' => [],
            "message" => "Unregistered Email"
        ]);
        exit();
    }
    elseif (!password_verify($password, $hashedPass)) {
        echo json_encode([
            "success" => false,
            'data' => [],
            "message" => "Incorrect Password"
        ]);
        exit();
    }
    else {
        $user = get_user_by_email($conn, $email);
        $_SESSION['userID'] = $user['id'];
        $_SESSION['admin'] = $user['user_role'] == 'Admin';
        echo json_encode([
            "success" => true,
            "data" => ['user_role' => $user['user_role']],
            "message" => "Login Successful"
        ]);
        exit();
    }
}
catch (Exception $e) {
    error_log("Error in login.php : " . $e->getMessage());
}
finally {
    echo json_encode([
        "success" => false,
        'data' => [],
        "message" => "Error Occured"
    ]);
}