<?php
require 'database.php';
ini_set("session.cookie_httponly", 1);
session_start();
	
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

$username = $_SESSION['username'];
$eventTitle = (string)$_POST['eventTitle'];
$eventContent = (string)$_POST['eventContent'];
$eventDate = (string)$_POST['eventDate'];
$eventTime = (string)$_POST['eventTime'];
		
if (strcmp($eventTitle, "") == 0 || strcmp($eventContent, "") == 0 || strcmp($eventDate, "") == 0 || strcmp($eventTime, "") == 0) {
	header('HTTP/1.0 400 Bad Request', true, 400);
	die("Some input is missing.");
}

$stmt = $mysqli->prepare("INSERT INTO events (username, event_title, event_content, event_date, event_time) VALUES (?, ?, ?, ?, ?)");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt->bind_param('sssss', $username, $eventTitle, $eventContent, $eventDate, $eventTime);
$stmt->execute();
		
if ($mysqli->affected_rows > 0) {
	echo json_encode(array(
		"success" => true
	));
	exit;
} else {
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect format of inputs"
	));
	exit;
}

$stmt->close();
		
?>