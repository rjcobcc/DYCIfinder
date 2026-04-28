<?php

function insert_item_claim($conn, // returns int (inserted row ID) or 0 if insert failed
    $user_id, 
    $item_id, 
    $claim_description,
    $image_url1,
    $image_url2,
    $claimant_name,
    $facebook_profile,
    $contact_number,
    $email_address
) {
    $sql = "INSERT INTO item_claims 
    (user_id, found_item_id, claim_description, image_url1, image_url2, claimant_name, facebook_profile, contact_number, email_address) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iisssssss", $user_id, $item_id, $claim_description, $image_url1, $image_url2, $claimant_name, $facebook_profile, $contact_number, $email_address);
    $stmt->execute();
    $stmt->close();
    return $conn->insert_id; 
}