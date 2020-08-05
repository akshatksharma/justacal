<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
    session_id("user");
}

$id = empty($_SESSION['userid']) ? -1 : $_SESSION['userid'];

require "./model/queryRunner.php";
$queryrunner = new queryRunner();
$queryrunner->connect();
$result = $queryrunner->query("select id, title, user_id, start_date, start_time from events where user_id=?", "i", [$id]);

$data = array();
while ($row = $result->fetch_assoc()) {
    
//  if data[date] does not exist, initalize a new array with the info
//  else if it exists, then append to that array with the next info for that day


    $data[] = $row;
}

echo json_encode($data);