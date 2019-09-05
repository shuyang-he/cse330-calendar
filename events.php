<?php
require 'database.php';
ini_set("session.cookie_httponly", 1);
header("Content-Type: application/json"); 
session_start();
// Login succeeded!
$username= $_SESSION['username'];
//fetch table rows from mysql db
$stmt = $mysqli->prepare("SELECT event_id, username, event_title, event_content, event_date, event_time FROM events WHERE username = ?");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}
$stmt->bind_param('s', $username);
$stmt->execute();

$result = $stmt->get_result();
//create an array
$events=array();
while($row =mysqli_fetch_assoc($result)){
    $id = $row['event_id'];
    $events[$id] = array(
        'event_id' => htmlentities($row['event_id']),
        'username' => htmlentities($row['username']),
        'event_title' => htmlentities($row['event_title']),
        'event_content' => htmlentities($row['event_content']),
        'event_date' => htmlentities($row['event_date']),
        'event_time' => htmlentities($row['event_time'])
    );
}
$stmt->close();
echo json_encode($events);
?>
