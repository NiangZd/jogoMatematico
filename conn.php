<?php

    $servidor = 'localhost';
    $usuario = 'root';
    $senha = '';
    $banco = 'provafc';

    $conn = mysqli_connect($servidor, $usuario, $senha, $banco);

    if(!$conn){
        //echo 'ERRO NA CONEXÃO';
    } else {
        //echo 'CONEXÃO FEITA COM SUCESSO';
    }
?>