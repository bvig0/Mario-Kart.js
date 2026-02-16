import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
const rl = readline.createInterface({ input, output });
let player1 = null;
let player2 = null;

// personagens:
const mario = {
    nome: "Mario",
    velocidade: 4,
    manobrabilidade: 3,
    poder: 3,
    pontos: 0
}
const peach = {
    nome: "Peach",
    velocidade: 3,
    manobrabilidade: 4,
    poder: 2,
    pontos: 0
}
const yoshi = {
    nome: "Yoshi",
    velocidade: 2,
    manobrabilidade: 4,
    poder: 3,
    pontos: 0
}
const bowser = {
    nome: "Bowser",
    velocidade: 5,
    manobrabilidade: 2,
    poder: 5,
    pontos: 0
}
const luigi = {
    nome: "Luigi",
    velocidade: 3,
    manobrabilidade: 4,
    poder: 4,
    pontos: 0
}
const donkeyKong = {
    nome: "Donkey Kong",
    velocidade: 2,
    manobrabilidade: 2,
    poder: 5,
    pontos: 0
}

async function choosePlayer() {
    let character;
    console.log("\n1-Mario | 2-Peach | 3-Yoshi \n4-Bowser | 5-Luigi | 6-Donkey Kong");
    let op = Number(await rl.question("Digite o número correspondente ao personagem para selecionar ele: "));
    switch (op) {
        case 1: character = mario; break;
        case 2: character = peach; break;
        case 3: character = yoshi; break;
        case 4: character = bowser; break;
        case 5: character = luigi; break;
        case 6: character = donkeyKong; break;
        default: console.log("Opção inválida.");
            return choosePlayer(); // tenta de novo
    }
    console.log(`${character.nome} foi escolhido!`);
    return character;
}


async function rollD6() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
    let random = Math.random();
    let result = ""
    switch (true) {
        case random < 0.33: result = "RETA"; break;
        case random < 0.66: result = "CURVA"; break;
        default: result = "CONFRONTO"; break;
    }
    return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
    console.log(`${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`);
}

async function playRaceEngine(character1, character2) {
    for (let round = 1; round <= 5; round++) {
        console.log(`🏁 Rodada ${round}`);

        // sortear bloco
        let block = await getRandomBlock();
        console.log(`Bloco: ${block}`);

        // rolar os dados de 6 lados
        let diceResult1 = await rollD6();
        let diceResult2 = await rollD6();

        // teste de habilidade
        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if (block === "RETA") {
            totalTestSkill1 = diceResult1 + character1.velocidade;
            totalTestSkill2 = diceResult2 + character2.velocidade;

            await logRollResult(character1.nome, "velocidade", diceResult1, character1.velocidade);
            await logRollResult(character2.nome, "velocidade", diceResult2, character2.velocidade);
        }
        if (block === "CURVA") {
            totalTestSkill1 = diceResult1 + character1.manobrabilidade;
            totalTestSkill2 = diceResult2 + character2.manobrabilidade;

            await logRollResult(character1.nome, "manobrabilidade", diceResult1, character1.manobrabilidade);
            await logRollResult(character2.nome, "manobrabilidade", diceResult2, character2.manobrabilidade);
        }
        if (block === "CONFRONTO") {
            let powerResult1 = diceResult1 + character1.poder;
            let powerResult2 = diceResult2 + character2.poder;

            console.log(`${character1.nome} confrotou com ${character2.nome}! 🥊`);

            await logRollResult(character1.nome, "poder", diceResult1, character1.poder);
            await logRollResult(character2.nome, "poder", diceResult2, character2.poder);

            /*  Uma das maneiras de fazer estrutura de decisão, sendo essa abaixo o if ternário
            character2.pontos -= powerResult1 > powerResult2 && character2.pontos > 0 ? 1 : 0;
            character1.pontos -= powerResult2 > powerResult1 && character1.pontos > 0 ? 1 : 0;*/

            if (powerResult1 > powerResult2 && character2.pontos > 0) {
                console.log(`${character1.nome} venceu o confronto! ${character2.nome} perdeu 1 ponto. 🐢`);
                character2.pontos--;
            }
            if (powerResult2 > powerResult1 && character1.pontos > 0) {
                console.log(`${character2.nome} venceu o confronto! ${character1.nome} perdeu 1 ponto. 🐢`);
                character1.pontos--;
            }

            console.log(powerResult2 == powerResult1 ? "Confronto empatado! Nenhum ponto foi perdido." : "");
        }
        // verificando o vencedor
        if (totalTestSkill1 > totalTestSkill2) {
            console.log(`${character1.nome} marcou um ponto!`);
            character1.pontos++;
        } 
        if (totalTestSkill2 > totalTestSkill1) {
            console.log(`${character2.nome} marcou um ponto!`);
            character2.pontos++;
        }
        console.log(totalTestSkill2 == totalTestSkill1 ? "Empatado! Ninguém marcou ponto" : "");
        console.log("====================================================\n");
    }
}

async function declareWinner(character1, character2) {
    console.log("Resultado final:\n" +
        `${character1.nome}: ${character1.pontos} ponto(s).\n` +
        `${character2.nome}: ${character2.pontos} ponto(s).`
    );

    if (character1.pontos > character2.pontos) {
        console.log(`${character1.nome} venceu a corrida! Parabéns! 🏆`)
    } else if (character2.pontos > character1.pontos) {
        console.log(`${character2.nome} venceu a corrida! Parabéns! 🏆`)
    } else {
        console.log("A corrida terminou em empate.")
    }
}

// Função autoinvocável, mesma coisa que eu escrever "main();" em alguma linha
(async function main() {
    player1 = await choosePlayer();
    player2 = await choosePlayer();

    console.log(`🏁🚨 Corrida entre ${player1.nome} e ${player2.nome} começando...\n`);

    await playRaceEngine(player1, player2);
    await declareWinner(player1, player2);
})();

