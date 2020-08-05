<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
    session_id("user");
}

header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$userid = (string) $json_obj['userId'];
$commentid = (string) $json_obj['commentId'];
$token = (string) $json_obj['token'];

if (!hash_equals($_SESSION['token'], $token)) {
    echo json_encode(array(
        "sucess" => false,
        "message" => "Request forgery detected",
    ));
    exit;
}

require "./model/queryRunner.php";
$queryrunner = new queryRunner();
$queryrunner->connect();
$status = $queryrunner->modify("delete from events where id=? AND user_id=?", "ii", [$commentid, $userid]);

if ($status == true) {
    echo json_encode(array(
        "success" => true,
    ));
} else {
    echo json_encode(array(
        "success" => false,
    ));
}