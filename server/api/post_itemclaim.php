<?php
header("Content-Type: application/json");
session_start();

require_once __DIR__ . '/../conf/db.php';
require_once __DIR__ . '/../db/item_claims.php';
require_once __DIR__ . '/../lib/img_host.php';

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    $userID = $_SESSION['userID'] ?? null;
    $itemID = $_POST['item_id'];
    $description = $_POST['claimpost_description'];
    $imageURL1 = null;
    $imageURL2 = null;
    $ownerName = $_POST['claimpost_ownername'];
    $facebookProfile = $_POST['claimpost_ownerfb'];
    $contactNumber = $_POST['claimpost_ownerphone'];
    $emailAddress = $_POST['claimpost_owneremail'];

    // Convert image uploads to URLs with free image hosting
    $tmpDir = sys_get_temp_dir();                                                                       // Get the system temporary directory
    if (isset($_FILES['claimpost_image1']) && $_FILES['claimpost_image1']['error'] === UPLOAD_ERR_OK) { // Check if image is uploaded without errors
        $tmp1 = $tmpDir . "/" . uniqid("img1_") . "_" . $_FILES['claimpost_image1']['name'];            // Create a unique temporary file path
        move_uploaded_file($_FILES['claimpost_image1']['tmp_name'], $tmp1);                             // Move the uploaded file to the temporary location
        $imageURL1 = get_imageURL($tmp1);                                                               // Upload the image and get its URL
        unlink($tmp1);                                                                                  // Delete the temporary file path
    }                                    
    if (isset($_FILES['claimpost_image2']) && $_FILES['claimpost_image2']['error'] === UPLOAD_ERR_OK) {
        $tmp2 = $tmpDir . "/" . uniqid("img1_") . "_" . $_FILES['claimpost_image2']['name'];
        move_uploaded_file($_FILES['claimpost_image2']['tmp_name'], $tmp2);
        $imageURL2 = get_imageURL($tmp2);  
        unlink($tmp2);                                                                    
    }

    $insertedID = insert_item_claim(
        $conn,
        $userID,
        $itemID,
        $description,
        $imageURL1,
        $imageURL2,
        $ownerName,
        $facebookProfile,
        $contactNumber,
        $emailAddress
    );

    if ($insertedID > 0) {
        echo json_encode([
            "success" => true,
            "redirect" => "track.html?tab=claims",
            "data" => ["item_claim_id" => $insertedID]
        ]);
        exit();
    } 
}
catch (Exception $e) {
    error_log("Error in post_itemclaim.php : " . $e->getMessage());
}
finally {
    echo json_encode([
        "success" => false,
        "redirect" => null,
        "data" => ["item_claim_id" => 0]
    ]);
}