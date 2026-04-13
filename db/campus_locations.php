<?php
function getCampusLocations($conn) {
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
?>