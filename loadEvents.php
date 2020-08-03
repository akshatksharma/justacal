<?php
session_id("user");
session_start();

$id = empty($_SESSION['userid']) ? -1 : $_SESSION['userid'];

require "./model/queryRunner.php";
$queryrunner = new queryRunner();
$queryrunner->connect();
$result = $queryrunner->query("select title, user_id, start_date, start_time from events where user_id=?", "i", [$id]);

$data = array();

while ($row = $result->fetch_assoc()) {

    $data[$row["start_date"]] = $row;
}

echo json_encode($data);