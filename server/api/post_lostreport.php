<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../conf/db.php';
require_once __DIR__ . '/../db/lost_reports.php';
require_once __DIR__ . '/../lib/img_host.php';

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    $userID = $_SESSION['userID'] ?? null;
    $description = $_POST['description'];
    $category = $_POST['category'];
    $location = $_POST['location'];
    $facebook = $_POST['facebook'];
    $contact = $_POST['contact'];
    $loster = $_POST['loster'];
    $email = $_POST['email'];
    $date = $_POST['date'];
    $item = $_POST['item'];
    $image1URL = null;
    $image2URL = null;
    
    // Convert image uploads to URLs with free image hosting
    $tmpDir = sys_get_temp_dir();                                                   // Get the system temporary directory
    if (isset($_FILES['image1']) && $_FILES['image1']['error'] === UPLOAD_ERR_OK) { // Check if image1 is uploaded without errors
        $tmp1 = $tmpDir . "/" . uniqid("img1_") . "_" . $_FILES['image1']['name'];  // Create a unique temporary file path
        move_uploaded_file($_FILES['image1']['tmp_name'], $tmp1);                   // Move the uploaded file to the temporary location
        $image1URL = get_imageURL($tmp1);                                           // Upload the image and get its URL
        unlink($tmp1);                                                              // Delete the temporary file path
    }
    if (isset($_FILES['image2']) && $_FILES['image2']['error'] === UPLOAD_ERR_OK) {
        $tmp2 = $tmpDir . "/" . uniqid("img2_") . "_" . $_FILES['image2']['name'];
        move_uploaded_file($_FILES['image2']['tmp_name'], $tmp2);
        $image2URL = get_imageURL($tmp2);
        unlink($tmp2);
    }    

    $insertedID = insert_lostreport(
        $conn,
        $userID,
        $item,
        $category,
        $description,
        $location,
        $date,
        $image1URL,
        $image2URL,
        $loster,
        $facebook,
        $contact,
        $email
    );

    if ($insertedID > 0) {
        echo json_encode([
            "success" => true,
            "redirect" => "track.html?tab=losses",
            "data" => ["lost_report_id" => $insertedID]
        ]);
        exit();
    }
}
catch (Exception $e) {
    error_log("Error post_lost.php : " . $e->getMessage());
}
finally {
    echo json_encode([
        "success" => false,
        "redirect" => null,
        "data" => ["lost_report_id" => 0]
    ]);
}