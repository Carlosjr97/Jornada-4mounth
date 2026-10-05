const btnCompletefirstmission = document.getElementById("btnCompletefirstmission");
const btnCompletesecondmission = document.getElementById("btnCompletesecondmission");
const btnCompletethirdmission = document.getElementById("btnCompletethirdmission");
const btnCompletefourthmission = document.getElementById("btnCompletefourthmission");
const imgPersonagem = document.getElementById("imgPersonagem");
const imgDiamante = document.getElementById("imgDiamante");
const blockedOne = document.getElementById("blockedOne");
const blockedTwo = document.getElementById("blockedTwo");
const blockedThree = document.getElementById("blockedThree");
const palco = document.querySelector(".tela-inicial");
const porta = document.getElementById("porta");
const portaEsquerda = document.getElementById("portaEsquerda");
const portaDireita = document.getElementById("portaDireita");
const cadeado = document.getElementById("cadeado");
const telaGameOver = document.getElementById("telaGameOver");

// devolve o left de um elemento em % da largura do palco (igual usamos no CSS)
function leftEmPorcentagem(elemento) {
    return parseFloat(getComputedStyle(elemento).left) / palco.offsetWidth * 100;
}

// faz o personagem ir até um diamante, trazer até a porta e coletar
// diamante        = qual imagem de diamante ele vai buscar
// lugarNoTopo     = left onde o diamante fica guardado lá em cima (ex: "4%")
// quandoTerminar  = função que roda depois que o diamante foi coletado
function buscarDiamante(diamante, lugarNoTopo, quandoTerminar) {
    // posição atual do personagem e posição alvo (onde o diamante está)
    // usamos left porque é o left que posiciona os dois no CSS
    let posAtual = leftEmPorcentagem(imgPersonagem);
    const posInicial = posAtual; // guarda de onde ele saiu, para saber até onde voltar
    const posAlvo = leftEmPorcentagem(diamante);

    const passo = 0.8; // quantos % do palco o personagem anda em cada "tick"
    let frame = 1; // controla qual perna/imagem mostrar

    // 1ª PARTE: anda até o diamante
    const andando = setInterval(function () {
        posAtual -= passo; // diminuir o left = andar para a esquerda

        // chegou no diamante: para de andar e começa a levar o diamante
        if (posAtual <= posAlvo) {
            posAtual = posAlvo;
            clearInterval(andando);
            imgPersonagem.style.left = posAtual + "%";
            levarDiamante();
            return;
        }

        imgPersonagem.style.left = posAtual + "%"; // movendo personagem

        //alterna entre andando1 a andando4 (EFEITO DE PASSOS)
        imgPersonagem.src = `img/andando${frame}.png`;
        frame++;

        if (frame > 4) {
            frame = 1;
        }
    }, 100); // um "tick" a cada 100 milissegundos

    // 2ª PARTE: volta para a posição inicial carregando o diamante
    function levarDiamante() {
        frame = 1;
        diamante.style.animation = "none"; // para de flutuar
        diamante.style.bottom = "25%";     // altura das mãos do personagem

        const levando = setInterval(function () {
            posAtual += passo; // aumentar o left = andar para a direita

            // chegou de volta na porta: para e guarda o diamante
            if (posAtual >= posInicial) {
                posAtual = posInicial;
                clearInterval(levando);
                imgPersonagem.style.left = posAtual + "%";
                diamante.style.left = posAtual + "%";
                imgPersonagem.src = "img/parado.png";
                coletarDiamante();
                return;
            }
            imgPersonagem.style.left = posAtual + "%"; // movendo personagem
            diamante.style.left = posAtual + "%";      // diamante acompanha o personagem

            //alterna entre levando1 a levando4
            imgPersonagem.src = `img/levando${frame}.png`;
            frame++;

            if (frame > 4) {
                frame = 1;
            }
        }, 100);
    }

    // 3ª PARTE: o diamante voa para o topo da tela (coletado)
    function coletarDiamante() {
        diamante.style.transition = "left 1s ease-in-out, bottom 1s ease-in-out";
        diamante.style.left = lugarNoTopo;
        diamante.style.bottom = "41.9%";

        // depois que o diamante chega lá em cima (1 segundo), avisa que terminou
        setTimeout(quandoTerminar, 1000);
    }
}

// abre a porta do prédio, faz o personagem entrar e fecha a porta atrás dele
// quandoTerminar = função que roda depois que a porta fechou
function entrarNoPredio(quandoTerminar) {
    // 1ª PARTE: a porta abre (leva 1 segundo, o tempo do transition no CSS)
    porta.classList.add("aberta");

    setTimeout(function () {
        // 2ª PARTE: o personagem sobe até a porta e diminui um pouco, como se estivesse se afastando
        imgPersonagem.style.transition = "bottom 1.5s linear, height 1.5s linear";
        imgPersonagem.style.bottom = "20.4%"; // pé na base da porta
        imgPersonagem.style.height = "16%";

        // efeito de passos enquanto ele entra
        let frame = 1;
        const entrando = setInterval(function () {
            imgPersonagem.src = `img/andando${frame}.png`;
            frame++;

            if (frame > 4) {
                frame = 1;
            }
        }, 150);

        setTimeout(function () {
            clearInterval(entrando);
            imgPersonagem.src = "img/parado.png";

            // 3ª PARTE: a porta fecha na frente do personagem
            portaEsquerda.style.zIndex = 2; // folhas passam para a frente do personagem
            portaDireita.style.zIndex = 2;
            porta.classList.remove("aberta");

            setTimeout(function () {
                imgPersonagem.style.display = "none"; // ele já está lá dentro
                quandoTerminar();
            }, 1000);
        }, 1500);
    }, 1000);
}

// 1ª MISSÃO: buscar o diamante azul
btnCompletefirstmission.addEventListener("click", function () {
    btnCompletefirstmission.style.display = "none"; // esconde a caixa da missão depois do clique

    buscarDiamante(imgDiamante, "80.1%", function () {
        // desbloqueia a 2ª missão
        blockedOne.src = "img/verde.png";                // o bloqueado vira o diamante verde
        btnCompletesecondmission.style.display = "flex"; // mostra a div da 2ª missão
    });
});

// 2ª MISSÃO: buscar o diamante verde
btnCompletesecondmission.addEventListener("click", function () {
    btnCompletesecondmission.style.display = "none";

    buscarDiamante(blockedOne, "83.1%", function () {
        // desbloqueia a 3ª missão
        blockedTwo.src = "img/roxo.png";                // o segundo bloqueado vira o diamante roxo
        btnCompletethirdmission.style.display = "flex"; // mostra a div da 3ª missão
    });
});

// 3ª MISSÃO: buscar o diamante roxo
btnCompletethirdmission.addEventListener("click", function () {
    btnCompletethirdmission.style.display = "none";

    buscarDiamante(blockedTwo, "86.1%", function () {
        // desbloqueia a 4ª missão
        blockedThree.src = "img/dourado.png";           // o terceiro bloqueado vira o diamante dourado
        btnCompletefourthmission.style.display = "flex"; // mostra a div da 4ª missão
    });
});

// 4ª MISSÃO: buscar o diamante dourado
btnCompletefourthmission.addEventListener("click", function () {
    btnCompletefourthmission.style.display = "none";

    buscarDiamante(blockedThree, "89.1%", function () {
        // com os 4 diamantes no lugar, o cadeado destranca (cai e some em 0.6 segundo)
        cadeado.classList.add("destrancado");

        // depois a porta abre e o personagem entra
        setTimeout(function () {
            entrarNoPredio(function () {
                // GAME OVER: mostra a tela com a imagem e o botão de reiniciar
                telaGameOver.classList.add("visivel");
            });
        }, 800);
    });
});
