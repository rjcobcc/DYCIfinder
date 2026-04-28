<?php

function login_block() {
    if (!isset($_SESSION['userID'])) {
        echo json_encode([
            "success" => false,
            "redirect" => "auth.html",
            "data" => [],
            "message" => "Invalid Session"
        ]);
        exit();
    }
}



function admin_block() {
    if (!isset($_SESSION['userType']) || $_SESSION['userType'] != "Admin") {
        echo json_encode([
            "success" => false,
            "redirect" => "search_found.html",
            "data" => [],
            "message" => "Unauthorized Access"
        ]);
        exit();
    }
}