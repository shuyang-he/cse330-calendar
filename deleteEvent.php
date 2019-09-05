<?php
require 'database.php';
session_start();
	
header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

$eventID = (int)$_POST['eventID'];
		
if (strcmp($eventID, "") == 0) {
	header('HTTP/1.0 400 Bad Request', true, 400);
	die("Some input is missing.");
}

$stmt = $mysqli->prepare("DELETE FROM events WHERE event_id = ?");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt->bind_param('i', $eventID);

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