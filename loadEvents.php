<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
    session_id("user");
}
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$filter = (string) $json_obj['filter'];
$id = empty($_SESSION['userid']) ? -1 : $_SESSION['userid'];

require "./model/queryRunner.php";
$queryrunner = new queryRunner();
$queryrunner->connect();
if ($filter == "") {
    $result = $queryrunner->query("select id, title, user_id, start_date, start_time, color, tag from events where user_id=?", "i", [$id]);
} else {
    $result = $queryrunner->query("select id, title, user_id, start_date, start_time, color, tag from events where user_id=? AND tag=?", "is", [$id, $filter]);
}

$data = array();
while ($row = $result->fetch_assoc()) {
//  if data[date] does not exist, initalize a new array with the info
    //  else if it exists, then append to that array with the next info for that day
    if (!array_key_exists($row["start_date"], $data)) {
        $data[$row["start_date"]] = [$row];
    } else {
        $data[$row["start_date"]][] = $row;
    }
}

echo json_encode($data);