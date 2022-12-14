/**
 *
 */
class Carta {
    /**
     * Cria uma instância de uma carta com seus atributos de identificação
     * @param {string} carta letra ou número que identifica a carta
     * @param {string} naipe naipe que identifica a carta
     * @param {number} valor valor da carta na pontuação
     * @param {number} ordem ordem de potência da carta em relação as demais (considerando apenas sua identificação)
     */
    constructor(carta, naipe, valor, ordem) {
        /** @type string */
        this.carta = carta;
        /** @type string */
        this.naipe = naipe;
        /** @type number */
        this.valor = valor;
        /** @type number */
        this.ordem = ordem;
    }

    /**
     * Escreve a identificação da carta no formato em que geralmente é lida pelos humanos
     * @returns {string} Identificação da carta
     */
    printCarta() {
        return `${this.carta} de ${this.naipe}`;
    }
}

/**
 *
 */
class Baralho {
    /**
     * Cria uma instância de um baralho com todas as combinações de cartas e
     * naipes para bisca (usando a classe Carta para preencher o baralho)
     */
    constructor() {
        /** @type Carta[] */
        this.baralho = [];

        /** @type Carta */
        this.trunfo;

        this.novoBaralho();
        this.embaralhar();
        this.pegarTrunfo();
    }

    /**
     * Gera um novo set de cartas embaralhadas
     */
    novoBaralho() {
        let valores = [
            { carta: "2", valor: 0 },
            { carta: "3", valor: 0 },
            { carta: "4", valor: 0 },
            { carta: "5", valor: 0 },
            { carta: "6", valor: 0 },
            { carta: "Q", valor: 2 },
            { carta: "J", valor: 3 },
            { carta: "K", valor: 4 },
            { carta: "7", valor: 10 },
            { carta: "A", valor: 11 },
        ];
        let naipes = ["copas", "espadas", "ouros", "paus"];

        valores.forEach(({ carta, valor }, ordem) => {
            naipes.forEach((naipe) => {
                this.baralho.push(new Carta(carta, naipe, valor, ordem));
            });
        });
    }

    /**
     * Faz o embaralhamento do baralho já definido
     */
    embaralhar() {
        /** @type Carta[] */
        let embaralhado = [];

        while (this.baralho.length > 0) {
            let randPos = Math.floor(Math.random() * this.baralho.length);
            embaralhado.push(...this.baralho.splice(randPos, 1));
        }

        this.baralho = embaralhado;
    }

    /**
     * Define o trunfo como a última carta no fundo do baralho pelo resto da partida
     */
    pegarTrunfo() {
        this.trunfo = this.baralho[this.baralho.length - 1];
    }

    /**
     * Remove uma carta do topo do baralho e a retorna
     * @returns {Carta} Carta do topo do baralho
     */
    pegarCarta() {
        return this.baralho.splice(0, 1)[0];
    }

    /**
     * Verifica a quantidade de cartas que restam no baralho
     * @returns {number} Inteiro referente a quantidade de cartas restantes
     */
    cartasRestantes() {
        return this.baralho.length;
    }
}

/**
 *
 */
class Player {
    /**
     * Cria uma instância de um jogador com nome e inicializa a
     * sua mão (vetor de cartas) vazia e seus pontos como 0
     * @param {string} nome Nome de identificação do jogador
     */
    constructor(nome) {
        this.nome = nome;
        this.mao = [];
        this.pontos = 0;
    }

    /**
     * Adiciona uma carta à mão do jogador
     * @param {Carta} carta Carta a ser adicionada à mão do jogador
     */
    receberCarta(carta) {
        this.mao.push(carta);
    }

    /**
     * Remove uma carta aleatória da mão do jogador e a retorna
     * @returns {Carta} Carta que o jogador usou
     */
    usarCarta() {
        let randPos = Math.floor(Math.random() * this.mao.length);
        return this.mao.splice(randPos, 1)[0];
    }

    /**
     * Adiciona uma quantidade de pontos ao placar do jogador
     * @param {number} pontos Pontos a serem adicionados ao jogador
     */
    adicionarPontos(pontos) {
        this.pontos += pontos;
    }

    /**
     * Consulta a quantidade de pontos do jogador
     * @returns {number} Total do pontos do jogador
     */
    consultarPontos() {
        return this.pontos;
    }
}

/**
 *
 */
class Bisca {
    /**
     * Cria uma instância de um jogo de bisca, criando também
     * os jogadores informados e atribuindo um baralho embaralhado
     * à partida.
     * Permite apenas 2 ou 4 jogadores por partida.
     * @param {string} p1 Nome do jogador 1
     * @param {string} p2 Nome do jogador 2
     * @param {string} p3 Nome do jogador 3
     * @param {string} p4 Nome do jogador 4
     */
    constructor(p1, p2, p3 = null, p4 = null) {
        if (!p1 || !p2 || (p3 && !p4)) throw "O jogo foi feito para apenas 2 ou 4 jogadores";

        /** @type {Baralho} */
        this.baralho = new Baralho();

        /** @type {Player[]} */
        this.players = [p1, p2, p3, p4].filter((p) => p && typeof p === "string").map((p) => new Player(p));

        /** @type {Player[]} */
        this.time1 = this.players.filter((p, i) => i % 2 === 0);

        /** @type {Player[]} */
        this.time2 = this.players.filter((p, i) => i % 2 === 1);
    }

    /**
     * Distribui cartas do topo do baralho para todos os jogadores
     */
    darCartas() {
        this.players.forEach((player) => {
            let cartaPuxada = this.baralho.pegarCarta();
            player.receberCarta(cartaPuxada);
        });
    }

    /**
     * Reordena o vetor de jogadores para que o vencedor da
     * última rodada seja o primeiro da próxima
     * @param {number} indexInicial index atual do jogador vencedor da última rodada
     */
    reordenarPlayers(indexInicial) {
        /** @type {Player[]} */
        let novaOrdemPlayers = [];

        for (let i = indexInicial; i < this.players.length + indexInicial; i++) {
            let pegarPos = i % this.players.length;
            let pegarPlayer = this.players[pegarPos];
            novaOrdemPlayers.push(pegarPlayer);
        }

        this.players = novaOrdemPlayers;
    }

    /**
     * Todos os jogadores usam uma carta e é definida a carta vencedora da rodada
     * @param {Carta} trunfo Carta trunfo do baralho
     * @returns Objeto contendo a carta vencedora, o index do jogador vencedor
     * e o vetor com todas as Cartas jogadas na rodada
     */
    jogarCartas(trunfo) {
        /** @type {Carta} */
        let cartaGanhador;

        /** @type {Carta} */
        let indexGanhador;

        /** @type {Carta[]} */
        let jogadas = [];

        this.players.forEach((player, i) => {
            let jogada = player.usarCarta();

            jogadas.push(jogada);

            if (
                !cartaGanhador ||
                (cartaGanhador.naipe === jogada.naipe && cartaGanhador.ordem < jogada.ordem) ||
                (cartaGanhador.naipe !== jogada.naipe && jogada.naipe === trunfo.naipe)
            ) {
                cartaGanhador = jogada;
                indexGanhador = i;
            }
        });

        return { cartaGanhador, indexGanhador, jogadas };
    }

    /**
     * Itera pelo vetor de jogadores, imprime a jogada de cada um e quem foi o vencedor
     * @param {number} indexGanhador Index do vencedor da rodada
     * @param {Carta[]} jogadas Vetor com as Cartas jogadas na rodada
     */
    printJogadas(indexGanhador, jogadas) {
        this.players.forEach((player, i) => {
            let cartaPlayer = `${i + 1} - ${player.nome}: ${jogadas[i].printCarta()}`;
            let vencedorPlayer = i === indexGanhador ? " (vencedor)" : "";

            console.log(cartaPlayer + vencedorPlayer);
        });
    }

    /**
     * Retorna o total de pontos que foram jogados na rodada
     * @param {Carta[]} jogadas Vetor com as Cartas jogadas na rodada
     * @returns {number} Total de pontos da rodada
     */
    pontosRodada(jogadas) {
        return jogadas.reduce((soma, { valor }) => soma + valor, 0);
    }

    /**
     * Contabiliza e atribui os pontos da rodada para o jogador vencedor
     * @param {number} indexGanhador Index do vencedor da rodada
     * @param {Carta[]} jogadas Vetor com as Cartas jogadas na rodada
     */
    darPontos(indexGanhador, jogadas) {
        let pontosRodada = this.pontosRodada(jogadas);
        this.players[indexGanhador].adicionarPontos(pontosRodada);
    }

    /**
     * Adiciona 3 cartas a mão de cada jogador da partida;
     */
    iniciar() {
        for (let i = 0; i < 3; i++) {
            this.darCartas();
        }
    }

    /**
     * Chama os métodos necessários para executar a rodada completa.
     * @description Realiza as jogadas da rodada, imprime os resultados,
     * computa os pontos para o vencedor e reordena os jogadores
     * conforme o vencedor da rodada
     * @param {number} rod Numero da rodada atual
     */
    rodada(rod) {
        /** @type {Carta} */
        let trunfo = this.baralho.trunfo;

        console.log(`\nRodada ${rod} (trunfo: ${trunfo.printCarta()}):`);

        let resultados = this.jogarCartas(trunfo);

        this.printJogadas(resultados.indexGanhador, resultados.jogadas);

        this.darPontos(resultados.indexGanhador, resultados.jogadas);

        this.reordenarPlayers(resultados.indexGanhador);
    }

    /**
     * Finaliza a partida, contabiliza os pontos e informa o vencedor
     */
    finalizar() {
        let pontosTime1 = this.time1.reduce((soma, player) => soma + player.consultarPontos(), 0);
        let pontosTime2 = this.time2.reduce((soma, player) => soma + player.consultarPontos(), 0);

        if (pontosTime1 === pontosTime2) {
            console.log(`\n\nEmpate! ${pontosTime1} x ${pontosTime2}`);
            return;
        }

        let ganhadores = pontosTime1 > pontosTime2 ? this.time1 : this.time2;

        let nomesGanhadores = ganhadores.map(({ nome }) => nome).join(" e ");

        let pontuacao = [pontosTime1, pontosTime2].sort((a, b) => (b > a ? 1 : -1)).join(" x ");

        console.log(`\n\nVitória de ${nomesGanhadores}! ${pontuacao}`);
    }

    /**
     * Roda o jogo de bisca inteiro
     */
    jogar() {
        this.iniciar();

        let rodadas = 0;
        while (this.baralho.cartasRestantes() > 0) {
            rodadas++;

            this.rodada(rodadas);
            this.darCartas();
        }

        for (let i = 0; i < 3; i++) {
            rodadas++;

            this.rodada(rodadas);
        }

        this.finalizar();
    }
}

/**
 * Função principal que cria e roda o jogo da bisca
 */
function main() {
    let bisquinha = new Bisca("Filipe", "Maja", "Gabriel", "Henrique");
    bisquinha.jogar();
}

main();
