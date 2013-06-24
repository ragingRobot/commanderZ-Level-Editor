<?php
$myFile = $_POST["file"];//".././levels.json";
$fh = fopen($myFile, 'w') or die("can't open file");
$stringData = $_POST["data"];
fwrite($fh, $stringData);
fclose($fh);
echo "saved";
?>