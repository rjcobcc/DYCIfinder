<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../../conf/db.php';
require_once __DIR__ . '/../../db/found_reports.php';
require_once __DIR__ . '/../../lib/util.php';

admin_block();

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    $item_name = $_POST['item_name'];
    $item_category = $_POST['item_category'];
    $item_desc = $_POST['item_desc'];
    $find_location = $_POST['find_location'];
    $find_date = $_POST['find_date'];
    $finder_full_name = $_POST['finder_full_name'];
    $finder_student_id = $_POST['finder_student_id'];
    $finder_course_section = $_POST['finder_course_section'];
    $finder_fb = $_POST['finder_fb'];
    $finder_phone = $_POST['finder_phone'];
    $finder_email = $_POST['finder_email'];
    $item_id = (int)$_POST['item_id'];

    $success = update_foundreport(
        $conn,
        $item_id,
        $item_name,
        $item_category,
        $item_desc,
        $find_location,
        $find_date,
        $finder_full_name,
        $finder_student_id,
        $finder_fb,
        $finder_phone,
        $finder_email,
        $finder_course_section
    );

    if ($success) {
        echo json_encode([
            "success" => true
        ]);
        exit();
    }
} 
catch (Exception $e) {
    error_log("Error in update_user.php : " . $e->getMessage());
} 
finally {
    echo json_encode([
        "success" => false
    ]);
}