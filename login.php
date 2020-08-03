<?php

require "./model/queryRunner.php";
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];
$passwordGuess = $json_obj['password'];

$queryrunner = new queryRunner();
$queryrunner->connect();
$result = $queryrunner->query("SELECT password, id from users where username=?", "s", [$username]);

// if username not found
if ($result->num_rows == 0) {
    echo json_encode(array(
        "success" => false,
        "message" => "Incorrect Username or Password",
    ));
    exit;
} else {
    // if found, check password
    while ($row = $result->fetch_assoc()) {$data = $row;}
    $passwordHash = $data["password"];

    if (password_verify($passwordGuess, $passwordHash)) {
        session_id("user");
        session_start();
        $_SESSION['userid'] = $data["id"];
        $_SESSION['username'] = $username;
        $_SESSION['token'] = bin2hex(random_bytes(32));

        echo json_encode(array(
            "userid" => $_SESSION['userid'],
            "username" => $_SESSION['username'],
            "token" => $_SESSION['token'],
        ));
    }
}