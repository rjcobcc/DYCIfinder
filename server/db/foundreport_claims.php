<?php

function insert_claim($conn, // returns int (inserted row ID) or 0 if insert failed
    $user_id, 
    $item_id, 
    $claim_description,
    $image_url,
    $claimant_name,
    $student_id,
    $course_section,
    $facebook_profile,
    $contact_number,
    $email_address
) {
    $sql = "INSERT INTO foundreport_claims
    (user_id, foundreport_id, claim_desc, image_url, owner_full_name, owner_student_id, owner_course_section, owner_fb, owner_phone, owner_email) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iissssssss", $user_id, $item_id, $claim_description, $image_url, $claimant_name, $student_id, $course_section, $facebook_profile, $contact_number, $email_address);
    $stmt->execute();
    $stmt->close();
    return $conn->insert_id; 
}



function get_user_foundreport_claims($conn, $page, $userID) {
    $pageLimit = 5;

    $sql = "SELECT frc.*, fr.item_name 
            FROM foundreport_claims frc
            JOIN found_reports fr ON frc.foundreport_id = fr.id
            WHERE frc.user_id = ?
            ORDER BY frc.id DESC
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



function get_claims($conn, $foundID) { // returns [] or [['id' => int, 'item_name' => string, ...], ...]
    $sql = "SELECT * FROM foundreport_claims WHERE foundreport_id = ? ORDER BY id DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $foundID);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    return $data;
}

function get_all_claims($conn) {
    $sql = "SELECT frc.*, fr.item_name FROM foundreport_claims frc LEFT JOIN found_reports fr ON frc.foundreport_id = fr.id ORDER BY frc.id DESC";
    $result = $conn->query($sql);
    if (!$result) {
        return [];
    }
    return $result->fetch_all(MYSQLI_ASSOC);
}



function set_claims_statuses($conn, $foundID, $status) { // returns int (number of rows updated) or 0 if update failed
    $sql = "UPDATE foundreport_claims SET claim_status = ? WHERE foundreport_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $status, $foundID);
    $success = $stmt->execute();
    $stmt->close();
    return $success;
}


function set_claim_status($conn, $claimID, $status) { // returns int (number of rows updated) or 0 if update failed
    $sql = "UPDATE foundreport_claims SET claim_status = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $status, $claimID);
    $success = $stmt->execute();
    $stmt->close();
    return $success;
}



function get_claim($conn, $id) {
    $sql = "SELECT * FROM foundreport_claims WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $claim = $result->fetch_assoc();
    $stmt->close();
    return $claim;
}