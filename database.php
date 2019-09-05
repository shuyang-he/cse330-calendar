<?php
// Content of database.php

$mysqli = new mysqli('localhost', 'php_user', 'php', 'module5');

if($mysqli->connect_errno) {
	printf("Connection Failed: %s\n", $mysqli->connect_error);
	exit;
}
?>