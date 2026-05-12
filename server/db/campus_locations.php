<?php

function get_campuslocation_names($conn) { // returns [] or [['location_name' => string], ...]
    $sql = "SELECT location_name FROM campus_locations";
    $result = $conn->query($sql);
    $rows = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
    }
    return $rows;
}

function get_campuslocations($conn) {
    $sql = "SELECT id, location_name FROM campus_locations ORDER BY location_name ASC";
    $result = $conn->query($sql);
    $rows = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
    }
    return $rows;
}

function insert_campuslocation($conn, $location_name) {
    $sql = "INSERT INTO campus_locations (location_name) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $location_name);
    $success = $stmt->execute();
    $stmt->close();
    return $success;
}

function delete_campuslocation($conn, $location_id) {
    $sql = "DELETE FROM campus_locations WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $location_id);
    $success = $stmt->execute();
    $stmt->close();
    return $success;
}