//INICIALIZA OS SEGUNDOS
let segundos = 0;

//ESSA FUNÇÃO VAI FAZER TODO O PROCESSO DE ATUALIZAÇÃO DE SEGUNDOS, A FUNÇÃO QUANDO CHAMADA VAI INICIALIZAR UM INTERVALO, QUE QUANDO FOR COMPLETO VAI INCREMENTAR OS SEGUNDOS, LOGO APÓS VAI ENVIAR UMA MENSAGEM PARA A OUTRA PARTE DO SCRIPT
function comecaContar() {
  setInterval(function() {
    //ESSA É UMA CONDIÇÃO PARA O CONTADOR CONTAR APENAS ATÉ 120 SEGUNDOS, O TEMPO LIMITE ATÉ QUE SE ESGOTE O TEMPO DA PESSOA E ELA NÃO POSSA MAIS DIGITAR
    if (segundos < 120) {
      segundos++;
    }
    //RETORNA UMA MENSAGEM PARA O SCRIPT PRINCIPAL ONDE FOI CHAMADO O WORKER
    postMessage(segundos);
  }, 1000);
}

//CHAMA A FUNÇÃO QUANDO O WORKER FOR INICIALIZADO
comecaContar();