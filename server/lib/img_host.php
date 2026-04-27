<?php
require_once __DIR__ . '/../conf/keys.php';



function get_imageURL($imagePath) { // returns url or null
    try{
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

        $result = json_decode($response, true);

        if (!$result['success']) return null;

        return $result['data']['url'] ?? null;
    }
    catch (Exception $e) {
        error_log("Error in img_host.php : " . $e->getMessage());
        return null;
    }
}