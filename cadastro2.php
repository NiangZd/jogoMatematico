<?php
    //TODA ESSA PÁGINA SERVE PARA VERIFICAR O CADASTRO OU NÃO
    require_once ('conn.php');

    print_r($_REQUEST);

?>

<?php

    $nome_cliente = $_POST['nome'];
    $senha_cliente = $_POST['senha'];
    $email_cliente = $_POST['email'];

    //VERIFICAÇÃO DOS EMAILS DO BANCO

    $busca_email = "SELECT*FROM login WHERE email = '$email_cliente'";
    $resultado_busca = mysqli_query($conn, $busca_email);
    $total_clientes = mysqli_num_rows($resultado_busca);

    //CONDIÇÃO PARA ACEITAR OU NÃO O EMAIL

    if ($total_clientes == 0) {

        $sql = "INSERT INTO login (nome, senha, email) VALUES ('$nome_cliente', '$senha_cliente', '$email_cliente')";

        $query = mysqli_query($conn, $sql);

        if(!$query){
            echo 'NÃO FOI POSSÍVEL REALIZAR AÇÃO';
            header('Location: login.php');
        } else {
            echo 'AÇÃO FEITA COM SUCESSO';
            header('Location: login.php');
        }

    } else {
        header('Location: login.php');
    }

?>