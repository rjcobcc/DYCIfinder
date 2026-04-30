<?php

function get_user_hashedpass($conn, $email) { // return string or null
    $stmt = $conn->prepare("
        SELECT hashed_pass FROM users WHERE email_address = ?
    ");

    $stmt->bind_param("s", $email);
    $stmt->execute();

    $res = $stmt->get_result();
    $row = $res->fetch_assoc();

    $stmt->close();
    return $row ? $row['hashed_pass'] : null;
}



function store_user_code($conn, $email, $code) { // return success, true or false
    $stmt = $conn->prepare("
        INSERT INTO users (email_address, register_code, register_code_created_at)
        VALUES (?, ?, NOW())
        ON DUPLICATE KEY UPDATE
            register_code = VALUES(register_code),
            register_code_created_at = NOW()
    ");

    $stmt->bind_param("si", $email, $code);
    $result = $stmt->execute();

    $stmt->close();
    return $result;
}



function get_valid_user_code($conn, $email) { // return code or null
    $stmt = $conn->prepare("
        SELECT register_code 
        FROM users 
        WHERE email_address = ? 
        AND hashed_pass IS NULL
        AND register_code_created_at >= (NOW() - INTERVAL 5 MINUTE)
    ");

    $stmt->bind_param("s", $email);
    $stmt->execute();

    $res = $stmt->get_result();
    $row = $res->fetch_assoc();

    $stmt->close();
    return $row ? $row['register_code'] : null;
}



function edit_user_attribute($conn, $id, $column, $input) { // return success, true or false
    $stmt = $conn->prepare("
        UPDATE users SET $column = ? WHERE id = ?
    ");

    $stmt->bind_param("si", $input, $id);
    $result = $stmt->execute();

    $stmt->close();
    return $result;
}



function get_user_by_id($conn, $id) { // return null or ['id' => int, 'user_role' => string]
    $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $res = $stmt->get_result();
    $row = $res->fetch_assoc();

    $stmt->close();
    return $row;
}



function get_user_by_email($conn, $email) { // return null or ['id' => int, 'user_role' => string]
    $stmt = $conn->prepare("SELECT * FROM users WHERE email_address = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $res = $stmt->get_result();
    $row = $res->fetch_assoc();

    $stmt->close();
    return $row;
}



function update_user_profile($conn, $id, $fullname, $studentid, $fbprofile, $contactno, $courseSection) { // return success, true or false
    $stmt = $conn->prepare("
        UPDATE users SET full_name = ?, student_id = ?, facebook_url = ?, phone_number = ?, course_section = ? WHERE id = ?
    ");

    $stmt->bind_param("sssssi", $fullname, $studentid, $fbprofile, $contactno, $courseSection, $id);
    $result = $stmt->execute();

    $stmt->close();
    return $result;
}