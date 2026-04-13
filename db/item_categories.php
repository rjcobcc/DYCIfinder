<?php
function getItemCategories($conn) {
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
?>