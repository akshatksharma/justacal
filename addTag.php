<?php
session_id("user");
session_start();

header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$tag = (string) $json_obj['tag'];
$color = (string) $json_obj['color'];
$userid = empty($_SESSION['userid']) ? null : $_SESSION['userid'];
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
$status = $queryrunner->modify("insert into tags (name, color, user_id) values (?,?,?)", "ssi", [$tag, $color, $userid]);
if ($status == true) {
    echo json_encode(array(
        "success" => true,
        "tag" => htmlentities($tag),
        "color" => htmlentities($color),
    ));
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Failed to add tag",
    ));

}