<?php
require 'database.php';

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

$username = (string)$_POST['username'];
$password = (string)$_POST['password'];
		
if (strcmp($username, "") == 0 || strcmp($password, "") == 0) {
	header('HTTP/1.0 400 Bad Request', true, 400);
	die("Some input is missing.");
}

$hashed = password_hash($password, PASSWORD_DEFAULT);
$stmt = $mysqli->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt->bind_param('ss', $username, $hashed);
$stmt->execute();
		
if ($mysqli->affected_rows > 0) {
	echo json_encode(array(
		"success" => true
	));
	exit;
} else {
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password"
	));
	exit;
}

$stmt->close();
		
?>