<?php

require "./model/queryRunner.php";

session_id("user");
session_start();
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];
$passwordRaw = $json_obj['password'];
$passwordSH = password_hash($passwordRaw, PASSWORD_DEFAULT);

$queryrunner = new queryRunner();
$queryrunner->connect();
$queryrunner->modify("insert into users (username, password) values (?,?)", "ss", [$username, $passwordSH]);

$data = array("success" => true);

echo json_encode($data);