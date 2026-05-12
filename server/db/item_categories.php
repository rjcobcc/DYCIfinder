<?php

function get_itemcategory_names($conn) { // returns [] or [['category_name' => string], ...]
    $sql = "SELECT category_name FROM item_categories";
    $result = $conn->query($sql);
    $rows = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
    }
    return $rows;
}

function get_itemcategories($conn) {
    $sql = "SELECT id, category_name FROM item_categories ORDER BY category_name ASC";
    $result = $conn->query($sql);
    $rows = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
    }
    return $rows;
}

function insert_itemcategory($conn, $category_name) {
    $sql = "INSERT INTO item_categories (category_name) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $category_name);
    $success = $stmt->execute();
    $stmt->close();
    return $success;
}

function delete_itemcategory($conn, $category_id) {
    $sql = "DELETE FROM item_categories WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $category_id);
    $success = $stmt->execute();
    $stmt->close();
    return $success;
}