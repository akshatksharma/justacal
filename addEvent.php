<?php
session_id("user");
session_start();

header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$name = (string) $json_obj['name'];
$date = (string) $json_obj['date'];
$time = (string) $json_obj['time'] . ":00";
$userid = empty($_SESSION['userid']) ? -1 : $_SESSION['userid'];
$token = (string) $json_obj['token'];

// need to validate data
//
//

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
$status = $queryrunner->modify("insert into events (title, user_id, start_date, start_time) values (?,?,?,?)", "siss", array($name, $userid, $date, $time));
if ($status == true) {
    $id = $queryrunner->getInsertId();
    echo json_encode(array(
        "success" => true,
        "id" => htmlentities($id),
        "title" => htmlentities($name),
        "start_date" => htmlentities($date),
        "start_time" => htmlentities($time),
    ));
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Failed to add event",
    ));

}