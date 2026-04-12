<?php
require_once __DIR__ . '/../conf/keys.php';

function uploadAndGetImageURL($imagePath) {
    if (!$imagePath) return null;
    $imageData = base64_encode(file_get_contents($imagePath));
    $post = [
        'key' => IMAGES_HOST_KEY,
        'image' => $imageData
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.imgbb.com/1/upload');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);
    return $result['data']['url'] ?? null;
}
?>