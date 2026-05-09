<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/users.php';
require_once __DIR__ . '/../../conf/email.php';
require_once __DIR__ . '/../../lib/emailer.php';

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    $inputs = json_decode(file_get_contents("php://input"), true);

    $email = $inputs['email'];

    if (get_user_hashedpass($conn, $email)) {
        echo json_encode([
            "success" => false,
            "message" => "Already Registered"
        ]);
        exit();
    }

    $code = random_int(100000, 999999);
    if (!store_user_code($conn, $email, $code)) throw new Exception();

    $subject = "Your " . PROJECT_NAME . " Verification Code";
    $body = "
        <html>
        <body>
            <h2>Verification Code</h2>
            <p>Your verification code is: <strong>$code</strong></p>
            <p>This code will expire in 5 minutes.</p>
        </body>
        </html>
    ";

    if (send_email($email, $subject, $body)) {
        echo json_encode([
            "success" => true,
            "message" => "Code Sent"
        ]);
        exit();
    }
}
catch (Exception $e) {
    error_log("Error in request_code.php : " . $e->getMessage());
}
finally {
    echo json_encode([
        "success" => false,
        "message" => "Error Occured"
    ]);
}