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
$updateTitle = (string) $json_obj['updateText'];
$updateDate = (string) $json_obj['updateDate'];
$updateTime = (string) $json_obj['updateTime'];
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
$status = $queryrunner->modify("update events set title=?, start_date=?, start_time=? where user_id=? AND id=?", "sssii", [$updateTitle, $updateDate, $updateTime, $userid, $commentid]);

if ($status == true) {
    echo json_encode(array(
        "success" => true,
        "id" => htmlentities($commentid),
        "title" => htmlentities($updateTitle),
        "start_date" => htmlentities($updateDate),
        "start_time" => htmlentities($updateTime),
    ));
} else {
    echo json_encode(array(
        "success" => false,
    ));
}