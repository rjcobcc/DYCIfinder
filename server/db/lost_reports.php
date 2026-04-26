<?php

function insertLostReport(
    $conn,
    $user_id,
    $item_name,
    $item_category,
    $item_description,
    $lost_location,
    $lost_date,
    $image_url1,
    $image_url2,
    $loster_name,
    $facebook_profile,
    $contact_number,
    $email_address
) {
    $sql = "INSERT INTO lost_reports 
        (user_id, item_name, item_category, item_description, lost_location, lost_date, image_url1, image_url2, loster_name, facebook_profile, contact_number, email_address) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "isssssssssss",
        $user_id,
        $item_name,
        $item_category,
        $item_description,
        $lost_location,
        $lost_date,
        $image_url1,
        $image_url2,
        $loster_name,
        $facebook_profile,
        $contact_number,
        $email_address
    );

    $stmt->execute();
    $insertId = $stmt->insert_id;

    $stmt->close();
    return $insertId;
}