<?php
// save_token.php

header('Content-Type: application/json');

// Read JSON input
$input = json_decode(file_get_contents('php://input'), true);
$token = $input['token'] ?? null;

if ($token) {
    // Example: store in a file (you can also use a database)
    file_put_contents('tokens.txt', $token . PHP_EOL, FILE_APPEND);
    echo json_encode(['status' => 'success', 'token' => $token]);
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No token received']);
}
?>
