<?php
    //STARTAR UMA SESSÃO PARA MANTER SEGURANÇA
    session_start();
    //RECUPERAR A CONEXÃO COM O BANCO DE DADOS
    require_once ('conn.php');

    //PEGAR OS POSTS ENVIADOS PELO LOGIN
    $email_cliente = $_POST['email'];
    $senha_cliente = $_POST['senha'];

    //FAZER UMA BUSCA NA TABELA LOGIN E VERIFICAR SE EXISTE O LOGIN QUE A PESSOA TENTOU FAZER
    $busca_login = "SELECT*FROM login WHERE email = '$email_cliente' AND senha = '$senha_cliente'";
    $resultado_busca = mysqli_query($conn, $busca_login);
    $total_clientes = mysqli_num_rows($resultado_busca);

    //SE EXISTIR ELE REDIRECIONA AO JOGO, SE NÃO, VAI PARA UM LOGIN DE FALHA
    if ($total_clientes == 1) {

        $_SESSION['email'] = $email_cliente;
        $_SESSION['senha'] = $senha_cliente;
        header('Location: index.php');

    }else {
        header('Location: login_falhou.php');
    }

?>