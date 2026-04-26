<?php

header("Content-Type: application/json");

require_once __DIR__ . '/../conf/db.php';
require_once __DIR__ . '/../db/found_reports.php';
require_once __DIR__ . '/../lib/img_host.php';

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    $description = $_POST['description'];
    $category = $_POST['category'];
    $location = $_POST['location'];
    $finder = $_POST['finder'];
    $item = $_POST['item'];
    $date = $_POST['date'];
    $image1URL = null;
    $image2URL = null;
    $userID = null;
    
    // Convert image uploads to URLs with free image hosting
    $tmpDir = sys_get_temp_dir();                                                   // Get the system temporary directory
    if (isset($_FILES['image1']) && $_FILES['image1']['error'] === UPLOAD_ERR_OK) { // Check if image1 is uploaded without errors
        $tmp1 = $tmpDir . "/" . uniqid("img1_") . "_" . $_FILES['image1']['name'];  // Create a unique temporary file path
        move_uploaded_file($_FILES['image1']['tmp_name'], $tmp1);                   // Move the uploaded file to the temporary location
        $image1URL = uploadAndGetImageURL($tmp1);                                   // Upload the image and get its URL
        unlink($tmp1);                                                              // Delete the temporary file path
    }
    if (isset($_FILES['image2']) && $_FILES['image2']['error'] === UPLOAD_ERR_OK) {
        $tmp2 = $tmpDir . "/" . uniqid("img2_") . "_" . $_FILES['image2']['name'];
        move_uploaded_file($_FILES['image2']['tmp_name'], $tmp2);
        $image2URL = uploadAndGetImageURL($tmp2);
        unlink($tmp2);
    }
    if (isset($_SESSION['userID'])) $userID = $_SESSION['userID'];

    $output = insertFoundReport(
        $conn,
        $userID,
        $finder,
        $item,
        $category,
        $description,
        $location,
        $date,
        $image1URL,
        $image2URL
    );
    
    echo json_encode([
        "success" => true,
        "redirect" => null,
        "found_report_id" => $output
    ]);
}
catch (Exception $e) {
    error_log("Error post_found.php : " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "redirect" => null,
        "found_report_id" => 0
    ]);
}