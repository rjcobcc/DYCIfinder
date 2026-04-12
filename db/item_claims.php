<?php
function insertItemClaim($conn, $data) {
    $sql = "INSERT INTO item_claims 
    (found_item_id, claim_description, claimant_name, facebook_profile, contact_number, email_address, additional_contact, proof_image_url1, proof_image_url2)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "issssssss",
        $data['item_id'],
        $data['description'],
        $data['name'],
        $data['fbProfile'],
        $data['contactno'],
        $data['email'],
        $data['contactinfo'],
        $data['image1'],
        $data['image2']
    );
    return $stmt->execute() ? $stmt->insert_id : -1;
}
?>