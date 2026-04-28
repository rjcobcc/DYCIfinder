<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../conf/db.php';
require_once __DIR__ . '/../db/found_reports.php';
require_once __DIR__ . '/../lib/img_host.php';

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    $userID = $_SESSION['userID'] ?? null;
    $description = $_POST['description'];
    $category = $_POST['category'];
    $location = $_POST['location'];
    $finder = $_POST['finder'];
    $item = $_POST['item'];
    $date = $_POST['date'];
    $imageURL = null;
    
    // Convert image uploads to URLs with free image hosting
    $tmpDir = sys_get_temp_dir();                                                   // Get the system temporary directory
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) { // Check if image is uploaded without errors
        $tmp1 = $tmpDir . "/" . uniqid("img1_") . "_" . $_FILES['image']['name'];  // Create a unique temporary file path
        move_uploaded_file($_FILES['image']['tmp_name'], $tmp1);                   // Move the uploaded file to the temporary location
        $imageURL = get_imageURL($tmp1);                                           // Upload the image and get its URL
        unlink($tmp1);                                                              // Delete the temporary file path
    }

    $insertedID = insert_foundreport(
        $conn,
        $userID,
        $finder,
        $item,
        $category,
        $description,
        $location,
        $date,
        $imageURL
    );

    if ($insertedID > 0) {
        echo json_encode([
            "success" => true,
            "redirect" => null,
            "data" => ["found_report_id" => $insertedID]
        ]);
        exit();
    }
}
catch (Exception $e) {
    error_log("Error in post_foundreport.php : " . $e->getMessage());
}
finally {
    echo json_encode([
        "success" => false,
        "redirect" => null,
        "data" => ["found_report_id" => 0]
    ]);
}