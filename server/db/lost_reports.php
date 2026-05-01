<?php

function insert_lostreport( // returns int (inserted row ID) or 0 if insert failed
    $conn,
    $user_id,
    $item_name,
    $item_category,
    $item_description,
    $lost_location,
    $lost_date,
    $image_url,
    $loster_name,
    $facebook_profile,
    $contact_number,
    $email_address,
    $coursection,
    $studentID
) {
    $sql = "INSERT INTO lost_reports 
        (user_id, item_name, item_category, item_desc, lost_location, lost_date, image_url, owner_full_name, owner_fb, owner_phone, owner_email, owner_course_section, owner_student_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "issssssssssss",
        $user_id,
        $item_name,
        $item_category,
        $item_description,
        $lost_location,
        $lost_date,
        $image_url,
        $loster_name,
        $facebook_profile,
        $contact_number,
        $email_address,
        $coursection,
        $studentID
    );

    $stmt->execute();
    $insertId = $stmt->insert_id;

    $stmt->close();
    return $insertId;
}