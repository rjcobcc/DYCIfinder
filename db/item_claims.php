<?php
function insertItemClaim($conn, $data) {
    $sql = "INSERT INTO item_claims 
    (found_item_id, claim_description, claimant_name, facebook_profile, contact_number, email_address, additional_contact)
    VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "issssss",
        $data['item_id'],
        $data['description'],
        $data['name'],
        $data['fbProfile'],
        $data['contactno'],
        $data['email'],
        $data['contactinfo']
    );

    if ($stmt->execute()) {
        return $stmt->insert_id;
    } 
    else {
        return -1;
    }
}
?>