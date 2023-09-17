let board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
let currentPlayer = "X";
let currentSpan = document.getElementById('current');
let gameWitchBot = false;
let mode = document.getElementById('mode');
//массив выигрышных комбинаций
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
//загружаем историю игры
let wins = localStorage.getItem("ticTacwins");
if (wins){
    wins = JSON.parse(wins)
} else{
    wins = [0, 0]
}
//отрисовываем историю игры
function setWins(){
    document.getElementById('x-win').innerHTML = wins[0];
    document.getElementById('o-win').innerHTML = wins[1];
}
setWins()
//функция хода
function makeMove(index) {
    if (board[index] === "-") {
        board[index] = currentPlayer;
        const button = document.querySelectorAll("#board button")[index];
        button.innerText = currentPlayer;

        if (currentPlayer === "O") {
            button.style.color = "#BE2220";
        }

        let gameEnded = false; // флаг для проверки, закончилась ли игра

        if (checkWin(currentPlayer)) {
            alert(currentPlayer + " победил!");
            currentPlayer === "X" ? (wins[0] = wins[0] + 1) : (wins[1] = wins[1] + 1);
            setWins();
            gameEnded = true; // устанавливаем флаг, что игра закончилась
        } else if (board.indexOf("-") === -1) {
            alert("Ничья!");
            gameEnded = true; // устанавливаем флаг, что игра закончилась
        }

        // сохраняем текущее состояние игры в localStorage после каждого хода
        localStorage.setItem("ticTacToeBoard", JSON.stringify(board));
        localStorage.setItem("ticTacwins", JSON.stringify(wins));
        localStorage.setItem("ticTacToeCurrentPlayer", currentPlayer);

        // если игра закончилась, сбрасываем игру
        if (gameEnded) {
            startNewGame();
            return;
        }

        // переключаем текущего игрока только если игра не закончилась
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        currentSpan.innerHTML = currentPlayer;
        if (gameWitchBot && !gameEnded) {
            makeBotMove();
        }
    }
}
//проверка на победу
function checkWin(player) {
    for (let combo of winningCombos) {
        if (board[combo[0]] === player && board[combo[1]] === player && board[combo[2]] === player) {
            return true;
        }
    }
    return false;
}
//начало новой игры
function startNewGame() {
    board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
    gameWitchBot = false;
    if (gameWitchBot) {
        mode.innerText = "Игрок Х Бот"
    } else {
        mode.innerText = "Игрок Х Игрок"
    }
    localStorage.setItem("ticTacToeBoard", JSON.stringify(board));
    currentPlayer = "X";
    currentSpan.innerHTML = currentPlayer;
    document.querySelectorAll("#board button").forEach(button => {
        button.innerText = "-";
        button.style.color = "black"; 
    });
}

const savedBoard = localStorage.getItem("ticTacToeBoard");
const savedCurrentPlayer = localStorage.getItem("ticTacToeCurrentPlayer");

// если есть сохраненное состояние, восстанавливаем его
if (savedBoard && savedCurrentPlayer) {
    board = JSON.parse(savedBoard);
    if (savedCurrentPlayer === "X"){
        currentPlayer = "O";
        
    } else {
        currentPlayer = "X"
    }
    currentSpan.innerHTML = currentPlayer;
} else {
    board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
    currentPlayer = "X";
}

// обновляем отображение кнопок
document.querySelectorAll("#board button").forEach((button, index) => {
    button.innerText = board[index];
    if (board[index] === "O") {
        button.style.color = "#BE2220";
    } else {
        button.style.color = "black";
    }
});

function showModal(){
    document.querySelector('.modal').classList.remove('hidden');
}

let botDifficulty = "easy"; // по умолчанию выбран простой уровень
let step = "first"; // по умолчанию человек ходит первый

const easy = document.getElementById("easy");
const hard = document.getElementById("hard");

easy.addEventListener("change", () => {
    botDifficulty = "easy";
});

hard.addEventListener("change", () => {
    botDifficulty = "hard";
});

const first = document.getElementById("first");
const second = document.getElementById("second");

first.addEventListener("change", () => {
    step = "first";
});

second.addEventListener("change", () => {
    step = "second";
});
//функция хода бота
function makeBotMove() {
    if (gameWitchBot) {
        let availableMoves = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "-") {
                availableMoves.push(i);
            }
        }

        let botMove;

        if (botDifficulty === "easy") {
            // простой уровень: выбираем случайный ход из доступных
            botMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        } else {
            // сложный уровень: использовать функцию findBestMove
            botMove = hardMoveBot();
            console.log(botMove);
            if (botMove == -1){
                botMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            }
        }

        board[botMove] = currentPlayer;
        const button = document.querySelectorAll("#board button")[botMove];
        button.innerText = currentPlayer;

        if (currentPlayer === "O") {
            button.style.color = "#BE2220";
        }

        let gameEnded = false;

        if (checkWin(currentPlayer)) {
            alert(currentPlayer + " победил!");
            currentPlayer === "X" ? (wins[0] = wins[0] + 1) : (wins[1] = wins[1] + 1);
            setWins();
            gameEnded = true;
        } else if (board.indexOf("-") === -1) {
            alert("Ничья!");
            gameEnded = true;
        }

        // сохраняем текущее состояние игры в localStorage
        localStorage.setItem("ticTacToeBoard", JSON.stringify(board));
        localStorage.setItem("ticTacToeCurrentPlayer", currentPlayer);

        if (gameEnded) {
            startNewGameBots();
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
    currentSpan.innerHTML = "X" ;
}
function hardMoveBot() {
    //определяем выигрышный ход для бота
    for (let i = 0; i < winningCombos.length; i++) {
        const combo = winningCombos[i];
        const cell1 = board[combo[0]];
        const cell2 = board[combo[1]];
        const cell3 = board[combo[2]];

        const countX = [cell1, cell2, cell3].filter(cell => cell === 'X').length;
        const countO = [cell1, cell2, cell3].filter(cell => cell === 'O').length;

        if (countO === 2 && countX === 0) {    
            const emptyCellIndex = [cell1, cell2, cell3].indexOf('-');
            return combo[emptyCellIndex];
        }
    }
    //определяем выигрышный ход для игрока
    for (let i = 0; i < winningCombos.length; i++) {
        const combo = winningCombos[i];
        const cell1 = board[combo[0]];
        const cell2 = board[combo[1]];
        const cell3 = board[combo[2]];

        const countX = [cell1, cell2, cell3].filter(cell => cell === 'X').length;
        const countO = [cell1, cell2, cell3].filter(cell => cell === 'O').length;


        if (countX === 2 && countO === 0) {
            const emptyCellIndex = [cell1, cell2, cell3].indexOf('-');
            return combo[emptyCellIndex];
        }
    }
    
    
    return -1; // если не нашли подходящую комбинацию, возвращаем -1 для рандомного хода
}

function startNewGameBots() {
    gameWitchBot = true;
    if (gameWitchBot) {
        mode.innerText = "Игрок Х Бот"
    } else {
        mode.innerText = "Игрок Х Игрок"
    }
    board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
    localStorage.setItem("ticTacToeBoard", JSON.stringify(board));
    document.querySelectorAll("#board button").forEach(button => {
        button.innerText = "-";
        button.style.color = "black"; // возвращаем черный цвет
    });
    
    // определяем, кто будет ходить первым, исходя из выбора пользователя
    currentPlayer = step === "first" ? "X" : "O";
    const selectedLevel = document.querySelector('input[name="level"]:checked');
    if (selectedLevel) {
        botDifficulty = selectedLevel.id;
    }
    document.querySelector('.modal').classList.add('hidden');

    // если первым ходит бот, вызываем функцию makeBotMove()
    if (currentPlayer === "O") {
        makeBotMove();
    }
}