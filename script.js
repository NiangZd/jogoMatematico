// INTERVALOS PARA EVITAR FICAR DEFININDO DENTRO DAS FUNÇÕES A CADA VEZ QUE FOR MUDAR O CÓDIGO
var min = 1;
var max = 100;

//VARIÁVEIS QUE PEGAM ELEMENTOS DO HTML PARA FICAR ALTERANDO FUTURAMENTE
var campoPergunta = document.getElementById('pergunta');
var botContinue = document.getElementById('btn-de-continuar');
var res;

var h3tempNormal = document.getElementById('h3-temporizador');
var tempNormal = document.getElementById('temporizador');

var tempParadoh3 = document.getElementById('h3-temp-Parado');
var tempParado = document.getElementById('temp-Parado');

//BOTÃO VERIFICAR
var btnVerif = document.getElementById('btn-de-verificar');

//VARIÁVEL PARA PEGAR A RESPOSTA DO USUÁRIO A CADA VEZ
var respostaUser;
var resVerificacao = document.getElementById('resVerificacao');
var iniciarCont = document.getElementById('contador-acerto');


//CONTADOR ACERTOS
var contAcertos = 0;

//FUNÇÃO PARA GERAR CADA QUESTÃO AO SER CHAMADA COM BOTÃO
function gerarQuestão() {

    //DESATIVA ALGUNS BOTÕES PARA EVITAR REPETIÇÃO DE CLICKS
    botContinue.style.display = 'none';
    resVerificacao.style.display = 'none';
    btnVerif.style.display = 'inline-block';

    //VARIÁVEIS DE NÚMEROS QUE VÃO FAZER OPERAÇÕES E AS PRÓPRIAS OPERAÇÕES

    var x, y;
    var operacao = ['+', '-', '*', '/'];
    var defOp;

    //O mathrRandom retorna valor entre 0 e 1, sendo que, multiplicado pelo intervalo completo, retornará um valor aleatório entre 0 incluído e seu máximo, pois depois é somado o mínimo (1) à subtração anterior do máximo pelo mínimo. Como é 100 poderia retirar o -min + 1, mas caso desejar colocar outro intervalo de números essa parte funciona normalmente.

    x = Math.floor(Math.random() * (max - min + 1)) + min;
    y = Math.floor(Math.random() * (max - min + 1)) + min;

    //CONDIÇÃO PARA FAZER MULTIPLICAÇÕES APENAS DO NÍVEL BÁSICO, OU SEJA, TABUADA ATÉ O 9
    if (x < 10 && y < 10) {
        defOp = Math.floor(Math.random() * 4);
        //AMBOS SWITCHS SÃO PARA ALEATORIZAR A OPERAÇÃO A SER REALIZADA, COMO ESTÁ ACIMA DESSA LINHA, TEM MAIS UM MATH.RANDOM ENTRE 0 E 2 PARA QUE POSSA ENTRAR NOS SWITCHS DE FORMA ALEATÓRIA
        switch (defOp) {
            case 0:
                res = x+y;
            break;
            case 1:
                res = x-y;
            break;
            case 2:
                res = x*y;
            break;
            case 3:
                res = x/y;
                res = Math.floor(res);
            break;
            default:
            break;
        }
    } else{
        defOp = Math.floor(Math.random() * 2);
        //JÁ FOI COMENTADO ACIMA, APENAS SEM A MULTIPLICAÇÃO E COM O MATH.RANDOM APENAS DE 0 E 1
        switch (defOp) {
            case 0:
                res = x+y;
            break;
            case 1:
                res = x-y;
            break;
            default:
            break;
        }
    }
    //RETORNA A RESPOSTA PARA O ELEMENTO HTML
    campoPergunta.textContent = `Qual o resultado da operação: ${x} ${operacao[defOp]} ${y}`
}


//FUNÇÃO PARA INICIAR TODO O JOGO
function iniciarContador() {
    //RETIRA O BOTÃO DE INICIAR PARA NÃO SER CLICADO NOVAMENTE
    var sumirBtnInit = document.getElementById('btn-de-iniciar');
    sumirBtnInit.style.display = 'none';
    //COLOCA NO ELEMENTO DO CONTADOR O A VARIÁVEL DE CONTAGEM
    iniciarCont.textContent = contAcertos;
    //DEIXA O BOTÃO DE VERIFICAÇÃO VISÍVEL
    btnVerif.style.display = 'inline-block';
}


//FUNÇÃO QUE VERIFICA A VALIDADE DAS RESPOSTAS, SE ESTIVER CERTA, ELE CONTINUA, SE ESTIVER ERRADA, ELE PARA O JOGO E ACABA
function verificarResposta() {
    //PEGA A RESPOSTA DO INPUT E LOGO ABAIXO TRANSFORMA EM INTEIRO, PARA QUE NÃO HAJA PROBLEMAS COM O TIPO DE DADO
    var respostaInput = document.getElementById('resposta');
    respostaUser = parseInt(respostaInput.value);

    //CONDIÇÕES PARA SABER SE O USUÁRIO ACERTOU OU ERROU A QUESTÃO
    if (respostaUser == res) {
        //SE TIVER ACERTADO, APARECERÁ A MENSAGEM QUE ACERTOU, O CONTADOR DE ACERTOS INCREMENTA 1, E ATUALIZA O ELEMENTO QUE RECEBE O CONTADOR DE ACERTOS, LOGO APÓS, RETIRA O BOTÃO DE VERIFICAÇÃO, PARA EVITAR QUE O USUÁRIO FIQUE SPAMMANDO O BOTÃO E GANHANDO ACERTOS
        resVerificacao.style.display = 'block';
        resVerificacao.textContent = 'RESPOSTA CORRETA! CONTINUE ASSIM!';
        contAcertos++;
        document.getElementById('cont-pontuacao-placar').textContent = contAcertos;
        iniciarCont.textContent = contAcertos;
        botContinue.style.display = 'inline-block';
        btnVerif.style.display = 'none';
    } else {
        //CASO NÃO TENHA ACERTADO A QUESTÃO, O USUÁRIO RECEBE A MENSAGEM QUE PERDEU, TODOS OS BOTÕES DA TELA SÃO RETIRADOS E OUTRO ELEMENTO HTML RECEBE OS RESULTADOS DOS SEGUNDOS NO DETERMINADO TEMPO QUE FOI PARADO O JOGO, MOSTRANDO NA TELA PARADO O TEMPO.
        resVerificacao.style.display = 'block';
        resVerificacao.textContent = 'RESPOSTA ERRADA, TENTE NOVAMENTE!';
    }
}

/*

https://www.braziljs.org/p/javascript-multi-threading-com-web-workers-2

Os Web Workers funcionam como threads, um processamento em background.

Podemos usá-los para executar tarefas extensas como ordenar uma lista muito grande, processar pontos de um mapa, criptografia, etc.

Cada Web Worker funcionará "fora" do escopo do browser, ou seja, em background, de forma totalmente independente da sua página web.

*/