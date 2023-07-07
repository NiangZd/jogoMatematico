<?php
  session_start();

  require_once 'conn.php';

  if((!isset($_SESSION['email']) == true) and (!isset($_SESSION['senha']) == true))
    {
        unset($_SESSION['email']);
        unset($_SESSION['senha']);
        header('Location: login.php');
    } 
      $logado = $_SESSION['email'];

      $sql = "SELECT * FROM login ORDER BY pontuacao DESC";

      $result = $conn->query($sql);

?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Desafio FC</title>
</head>
<body>

    <?php
      echo "<h1 class='h1-sis'>LOGADO COM <u>$logado</u> </h1>";
    ?>

<br>
    
    <h1>DESAFIO JOGO DE CONTAS MATEMÁTICAS</h1>
<br>
    <main>
        <h3 style="display: inline-block; font-size: 1em;" id="h3-temporizador">TEMPORIZADOR:</h3>
        <p style="display: inline-block; font-size: 1em;" id="temporizador">NÃO INICIADO</p>
        <h3 style="display: none; font-size: 1em;" id="h3-temp-Parado">TEMPORIZADOR PARADO:</h3>
        <p style="display: none; font-size: 1em;" id="temp-Parado"></p>
        <br>
        <h3 style="display: inline-block; font-size: 1em;">CONTADOR DE ACERTOS:</h3>
        <p style="display: inline-block; font-size: 1em;" id="contador-acerto">NÃO INICIADO</p>
        <br>
        <h3 style="display: inline-block; font-size: 1em;">PERGUNTA:</h3>
        <p style="display: inline-block; font-size: 1em;" id="pergunta"></p>

        <br>

        <h3 style="display: inline-block; font-size: 1em;">RESPOSTA:</h3>
        <input style="display: inline-block; font-size: 1em;" id="resposta"></input>

        <div>

            <div align="center" style="margin-top: 19px;">
                <button id="btn-de-iniciar" type="button" onclick="gerarQuestão(); iniciarContador(); iniciarOContador()" class="btn btn-dark">Iniciar</button>

                <button id="btn-de-verificar" style="display: none;" type="button" class="btn btn-info" onclick="verificarResposta()">Verificar</button>

                <button style="display: none;" id="btn-de-continuar" type="button" onclick="gerarQuestão()" class="btn btn-dark">Continuar</button>
                <br><br>
                <p style="display: inline-block; font-size: 1em;" id="resVerificacao"></p>
            </div>

            
        </div>
        

    </main><h2 id="logomarca">© NiangZd</h2>

                                        

                                    <!-- PLACAR DO JOGO-->


                                    
<div align="center" class="div-placar table-bg" style="width: 40%;">
                <table align="center" style="border-top: none;" class="table">
            <thead style="border-top: none;">
                <tr style="border-top: none;">
                    <th style="border-top: none;" scope="col">Pontuação</th>
                    <th style="border-top: none;" scope="col">Nome</th>
                    <th style="border-top: none;" scope="col">Email</th>
                </tr>
            </thead>
            <tbody>
                
                <?php

                    while($user_data = mysqli_fetch_assoc($result)){
                        echo "<tr>";
                        echo "<td id='cont-pontuacao-placar'>" . $user_data['pontuacao'] . "</td>";
                        echo "<td>" . $user_data['nome'] . "</td>";
                        echo "<td>" . $user_data['email'] . "</td>";
                        echo "<td>
                        </td>";
                        echo "</tr>";
                    }

                ?>

            </tbody>
            </table>
    </div>

    <script>
        //DEFINE UMA VARIÁVEL PARA RECEBER A INSTÂNCIA DO WEB WORKER
        let worker;

        function iniciarOContador() {
          //AQUI, A VARIÁVEL CRIADA CRIA A INSTÂNCIA DO WEB WORKER, COM O ARQUIVO DO WORKER.JS, LIGANDO AMBOS OS ARQUIVOS PARA QUE POSSA EXECUTAR AS PRÓXIMAS ETAPAS //A PARTIR DAQUI, MEIO QUE A FUNÇÃO COMEÇA A SER EXECUTADA EM OUTRA THREAD, E FICARÁ EXECUTANDO DENTRO DO WEB WORKER
          worker = new Worker("worker.js");

          //NESSA PARTE, O ONMESSAGE É DEFINIDO PARA EXECUTAR A FUNÇÃO DE RETORNO DA MENSAGEM QUE FOI ENVIADA PELO WEB WORKER PARA ESSA PARTE DO SCRIPT, SEMPRE QUE A MENSAGEM FOR RETORNADA DE ACORDO COM O SETINTERVAL() É EXECUTADA A FUNÇÃO E O VALOR DO TEMPORIZADOR É ATUALIZADO
          worker.onmessage = function(event) {
            //LOGO AQUI, O MESSAGE RECEBE O CONTEÚDO DA MENSAGEM E JÁ ATUALIZA O ELEMENTO TEMPORIZADOR PARA QUE OS SEGUNDOS SEJAM MOSTRADOS NO CONTADOR
            const message = event.data;
            document.getElementById('temporizador').textContent = message;
            //COMO O WEB WORKER NÃO TEM ACESSO DIRETO AO DOM, É NECESSÁRIO FAZER O PROCESSO DE MUDANÇA DE MENSAGENS A PARTIR DO CÓDIGO DA THREAD PRINCIPAL, OU SEJA, DIRETAMENTE LIGADA Á THREAD PRINCIPAL. AQUI, A MENSAGEM RETORNADA PELO WEB WORKER CONTENDO O SEGUNDOS É PASSADA PARA INTEIRO PARA QUE SEJA FEITA UMA VERIFICAÇÃO, ONDE, SE OS SEGUNDOS FOREM IGUAIS A 120, OS BOTÕES DA TELA SOMEM E A MENSAGEM 'TEMPO ESGOTADO!' É EXIBIDA AO JOGADOR.
            var messageInt = parseInt(message);
            if (messageInt == 120) {
                var pontos = document.getElementById('contador-acerto').textContent;
                //ENVIA UM POST PARA O ARQUIVO DE INSERIR PONTOS DO PHP, ONDE SERÁ PROCESSADO OS PONTOS E DADO UM UPDATE NO BANCO DE DADOS, JÁ QUE AO INICIAR UMA CONTA, A PONTUAÇÃO INICIA-SE COM 0.
                $.ajax({
                    url: 'inserirPonto.php',
                    method: 'POST',
                    data: { pontos: pontos },
                    success: function(response) {
                    },
                    error: function(xhr, status, error) {
                    console.error('Erro na requisição. Status: ' + xhr.status);
                    }
                });

              document.getElementById('btn-de-verificar').style.display = 'none';
              document.getElementById('btn-de-continuar').style.display = 'none';
              document.getElementById('resVerificacao').style.display = 'block';
              document.getElementById('resVerificacao').textContent = 'TEMPO ESGOTADO!';
            }
          };
        }

      </script>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="script.js"></script>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</body>

</html>