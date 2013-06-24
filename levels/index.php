<?php
    if ($handle = opendir('./')) {
	    while (false !== ($file = readdir($handle)))
	    {
	        if ($file != "." && $file != ".." && $file != "index.php")
	        {
	            $thelist .= '<LI><a href="index.html?level=levels/'.$file.'">'.$file.'</a>';
	        }
	    }
	    closedir($handle);
    }
?>

<P>List of files:</p>
<UL>
<P><?=$thelist?></p>
</UL>