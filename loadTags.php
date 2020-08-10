<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
    session_id("user");
}

$id = empty($_SESSION['userid']) ? -1 : $_SESSION['userid'];

require "./model/queryRunner.php";
$queryrunner = new queryRunner();
$queryrunner->connect();
$result = $queryrunner->query("select name, color from tags where user_id=?", "i", [$id]);

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);