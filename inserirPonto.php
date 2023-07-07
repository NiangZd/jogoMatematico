<?php
session_start();

require_once 'conn.php';

if ((!isset($_SESSION['email']) == true) and (!isset($_SESSION['senha']) == true)) {
  unset($_SESSION['email']);
  unset($_SESSION['senha']);
  header('Location: login.php');
}

$logado = $_SESSION['email'];

// RECEBE O POST DOS PONTOS
$pontos = $_POST['pontos'];

// VERIFICA SE TA TUDO CERTO COM O POST, PARA INSERIR
if (!empty($pontos)) {
  // OBTÉM A PONTUAÇÃO ATUAL DO USUÁRIO
  $sqlSelect = "SELECT pontuacao FROM login WHERE email = '$logado'";
  $result = $conn->query($sqlSelect);

  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $pontuacaoAtual = $row['pontuacao'];

    // VERIFICA SE OS NOVOS PONTOS SÃO MAIORES
    if ($pontos > $pontuacaoAtual) {
      // ATUALIZA A PONTUAÇÃO DO USUÁRIO
      $sqlUpdate = "UPDATE login SET pontuacao = '$pontos' WHERE email = '$logado'";

      if ($conn->query($sqlUpdate) === true) {
        // Pontos atualizados com sucesso
      }
    }
  }
}
?>