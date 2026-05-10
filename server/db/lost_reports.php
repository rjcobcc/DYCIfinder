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



function get_user_lostreports($conn, $page, $userID) {
    $pageLimit = 5;

    $sql = "SELECT * FROM lost_reports 
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT ? OFFSET ?";

    $page = max(1, (int)$page);
    $offset = ($page - 1) * $pageLimit;

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iii", $userID, $pageLimit, $offset);

    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);

    $stmt->close();
    return $data;
}



function get_losts($conn) {
    $sql = "SELECT * FROM lost_reports";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    return $data;
}