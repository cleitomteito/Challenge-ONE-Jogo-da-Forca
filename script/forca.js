//Seletores
let tela = document.querySelector("canvas");
let btnNovoJogoDesaparecer = document.getElementById("btn-novo-jogo").style.display = "none"
let btnDesistirDesaparecer = document.getElementById("btn-sair").style.display = "none"
let divAdicionarPalavra = document.getElementById("adicionar-palavra").style.display = 'none';
let btnNovoJogo = document.getElementById("btn-novo-jogo");
let btnDesistir = document.getElementById("btn-sair");
let btnCancelar = document.getElementById("btn-cancelar");

var palavras = ['JUPITER', 'FESTA', 'SOL', 'OURO', 'ALEGRIA', 'DESENHO', 'PROGRAMA', 'CULTURA'];
var tabuleiro = document.getElementById('forca').getContext('2d');
var adivinheAPalavra = "";
var letras = [];
var palavraCerta = "";
var erros = 8;
let letrasErradas = [];
let numeroDeErros = 8
let letraSelecionada = [];

//eventos

function atualizaPagina(){
  location.reload();
}
// atualiza a tela quando o usuário clica em "novo jogo"
btnNovoJogo.addEventListener("click", atualizaPagina);

// atualiza a tela quando o usuário clica em "desistir"
btnDesistir.addEventListener("click", atualizaPagina);

// atualiza a tela quando o usuário clica em "cancelar"
btnCancelar.addEventListener("click", atualizaPagina);

//faz o sorteio da palavra
function sorteiaPalavra() {
  let palavra = palavras[Math.floor(Math.random() * palavras.length)]
  adivinheAPalavra = palavra
  return palavra
}

// verifica qual foi a letra clicada
function verificarLetraClicada(key) {
  if (letras.length < 1 || letras.indexOf(key) < 0) {
    letras.push(key)
    return false
    
  }
  else {
    letras.push(key)
    return true
  }
}

function adicionarLetraCorreta(i) {
  palavraCerta += adivinheAPalavra[i].toUpperCase()
}

function adicionarLetraIncorreta(letter) {
  if (adivinheAPalavra.indexOf(letter) <= 0) {
    erros -= 1
  }
}

function verificarFimDeJogo(letra) {
  //checa se a letra já foi incluída no array de letras certas ou erradas
 if(letraSelecionada.length < adivinheAPalavra.length) { 
    //incluindo as letras já digitadas no array
    letrasErradas.push(letra);
    

    //valida se o usuário cometeu o número máximo de erros, para poder exibir a mesagem de fim de jogo
    if (letrasErradas.length > numeroDeErros) {
      exibirDerrota()
    }
    else if(letraSelecionada.length < adivinheAPalavra.length) {
      adicionarLetraIncorreta(letra)
      escreverLetraIncorreta(letra, erros)
    }
  }
 } 

//Verifica se o usuário ganhou
function verificarVencedor(letra) {
  letraSelecionada.push(letra.toUpperCase());
  if (letraSelecionada.length == adivinheAPalavra.length) {

    exibirVitoria()
    
  }
}

// impede que teclas como shift e outras sejam escritas
function verificarLetra(keyCode) {
  if (typeof keyCode === "number" && keyCode >= 65 && keyCode <= 90) {
    return true;
  } else {
    return false;
  }
}

// faz com que os botões da tela de home desapareçam e mostra a tela de adicionar palavra
function mostrarTelaAdicionarPalavra() {
  document.getElementById("div-desaparece").style.display = 'none';
  document.getElementById("adicionar-palavra").style.display = "block";
}

// salva a palavra que o usuário escreveu
function salvarPalavra() {
  
  //captura o que foi digitado
  let novaPalavra = document.getElementById('input-nova-palavra').value;

  // inclui a palavra digitada no array de palavras a serem sorteadas
  if(novaPalavra !== ""){
    palavras.push(novaPalavra.toUpperCase());
    alert('A palavra digitada foi salva')
    
  
    // faz a tela de adicionar palavra desaparecer
    document.getElementById("adicionar-palavra").style.display = "none";
    iniciarJogo();
  }
  else{
    alert("Nenhuma palavra foi digitada")
  }
}

//inicia o jogo
function iniciarJogo() {

  // faz com que os botões da tela home desapareçam
  document.getElementById("div-desaparece").style.display = 'none';

  //chama a função que desenha o canva
  desenharCanvas();

  //chama a função que sorteia a palavra 
  sorteiaPalavra();

  //chama a funão que desenha as linhas
  desenharLinhas();

  // faz com que os botões de "novo jogo" e "sair" apareceçam
  document.getElementById("btn-novo-jogo").style.display = "block"
  document.getElementById("btn-sair").style.display = "block"

  // captura a letra digitada
  document.onkeydown = (e) => {
    // coloca a letra digitada em maiúscula
    let letra = e.key.toUpperCase()
    //verifica si o usuário não perdeu
    if (letrasErradas.length <= numeroDeErros) {
      if (!verificarLetraClicada(e.key) && verificarLetra(e.keyCode)) {
        if (adivinheAPalavra.includes(letra)) {
          adicionarLetraCorreta(adivinheAPalavra.indexOf(letra))
          for (let i = 0; i < adivinheAPalavra.length; i++) {
            if (adivinheAPalavra[i] === letra) {
              escreverLetraCorreta(i)
              verificarVencedor(letra)

            }
          }

        }
        // se o usuário cometeu mais erros do que o permitido, chama as funcões
        // que desenham a forca e exibe a mesnagem de fim de jogo
        else {
          if (!verificarLetraClicada(e.key) && !verificarVencedor(letra)) return
          desenharForca(erros)
          verificarFimDeJogo(letra)
        }
      }
    }
    else {
      alert('Você atingiu o limíte de letras incorretas')
    }
  };
}