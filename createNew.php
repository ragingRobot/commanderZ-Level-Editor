<?php

$newName = "2.json"; //|| $_POST["name"];
$old = 'levels/start.json';// || $_POST["template"];

if($_POST["name"] != ""){
	$newName = $_POST["name"];
	
}

if($_POST["template"] != ""){
	
	$old  = $_POST["template"];
}

$new = 'levels/'. $newName;

copy($old, $new) or die("Unable to copy $old to $new.");

/* Redirect browser */
header("Location: index.html?level=levels/". $newName);
/* Make sure that code below does not get executed when we redirect. */
exit;
?>