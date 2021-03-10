<?php

    $password = 'senha123';

    if (IsSet($_POST ["key"]) && IsSet($_POST ["scores"])){
        if($password == $_POST ["key"]){
            $fp = fopen('hiscore.json', "w");
            fwrite($fp, $_POST ["scores"]);
            fclose($fp);    
        }
    }

?>