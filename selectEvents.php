<?php
require 'database.php';
ini_set("session.cookie_httponly", 1);
session_start();

header("Content-Type: application/json");

$username = $_SESSION['username'];

$stmt = $mysqli->prepare("SELECT * FROM events WHERE username = ?");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt->bind_param('s', $username);
$stmt->execute();

$result = $stmt->get_result();

$events;

while($row = $result->fetch_assoc()){
	echo "<div class=\"stories\">\n";
	echo "<div class=\"authors\">".$row["username"]."</div>";
	echo "<div class=\"titles\">".$row["story_title"]."</div>";
	echo "<div class=\"contents\">".$row["story_content"]."</div>";
	echo "<div class=\"links\">".$row["link"]."</div>";
	echo "</div>\n";
}

$stmt->close();
?>