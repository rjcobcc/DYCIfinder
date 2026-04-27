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