<?php
session_id("user");
session_start();

header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$name = (string) $json_obj['name'];
$color = (string) $json_obj['color'];
$tag = (string) $json_obj['tag'];
$date = (string) $json_obj['date'];
$time = (string) $json_obj['time'] . ":00";
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
$status = $queryrunner->modify("insert into events (title, user_id, start_date, start_time, tag, color) values (?,?,?,?,?,?)", "sissss", [$name, $userid, $date, $time, $tag, $color]);
if ($status == true) {
    $id = $queryrunner->getInsertId();
    echo json_encode(array(
        "success" => true,
        "id" => htmlentities($id),
        "title" => htmlentities($name),
        "start_date" => htmlentities($date),
        "start_time" => htmlentities($time),
        "tag" => htmlentities($tag),
        "color" => htmlentities($color),

    ));
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Failed to add event",
    ));

}