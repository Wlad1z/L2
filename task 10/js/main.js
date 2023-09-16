let board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
let currentPlayer = "X";
let currentSpan = document.getElementById('current');
let gameWitchBot = false;
let mode = document.getElementById('mode');

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
let wins = localStorage.getItem("ticTacwins");
if (wins){
    wins = JSON.parse(wins)
} else{
    wins = [0, 0]
}

function setWins(){
    document.getElementById('x-win').innerHTML = wins[0];
    document.getElementById('o-win').innerHTML = wins[1];
}
setWins()

function makeMove(index) {
    if (board[index] === "-") {
        board[index] = currentPlayer;
        const button = document.querySelectorAll("#board button")[index];
        button.innerText = currentPlayer;

        if (currentPlayer === "O") {
            button.style.color = "#BE2220";
        }

        let gameEnded = false; // Флаг для проверки, закончилась ли игра

        if (checkWin(currentPlayer)) {
            alert(currentPlayer + " победил!");
            currentPlayer === "X" ? (wins[0] = wins[0] + 1) : (wins[1] = wins[1] + 1);
            setWins();
            gameEnded = true; // Устанавливаем флаг, что игра закончилась
        } else if (board.indexOf("-") === -1) {
            alert("Ничья!");
            gameEnded = true; // Устанавливаем флаг, что игра закончилась
        }

        // Сохраняем текущее состояние игры в localStorage после каждого хода
        localStorage.setItem("ticTacToeBoard", JSON.stringify(board));
        localStorage.setItem("ticTacwins", JSON.stringify(wins));
        localStorage.setItem("ticTacToeCurrentPlayer", currentPlayer);

        // Если игра закончилась, сбрасываем игру
        if (gameEnded) {
            startNewGame();
            return;
        }

        // Переключаем текущего игрока только если игра не закончилась
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        currentSpan.innerHTML = currentPlayer;
        if (gameWitchBot && !gameEnded) {
            makeBotMove();
        }
    }
}

function checkWin(player) {
    for (let combo of winningCombos) {
        if (board[combo[0]] === player && board[combo[1]] === player && board[combo[2]] === player) {
            return true;
        }
    }
    return false;
}

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
    // Сбрасываем цвет для всех кнопок
    document.querySelectorAll("#board button").forEach(button => {
        button.innerText = "-";
        button.style.color = "black"; // Возвращаем черный цвет
    });
}

const savedBoard = localStorage.getItem("ticTacToeBoard");
const savedCurrentPlayer = localStorage.getItem("ticTacToeCurrentPlayer");

// Если есть сохраненное состояние, восстанавливаем его
if (savedBoard && savedCurrentPlayer) {
    board = JSON.parse(savedBoard);
    if (savedCurrentPlayer === "X"){
        currentPlayer = "O";
        
    } else {
        currentPlayer = "X"
    }
    currentSpan.innerHTML = currentPlayer;
} else {
    // Иначе сбрасываем игру в начальное состояние
    board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
    currentPlayer = "X";
}

// Обновляем отображение кнопок
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

let botDifficulty = "easy"; // По умолчанию выбран простой уровень
let step = "first"; // По умолчанию человек ходит первый

// Элементы интерфейса для выбора сложности
const easy = document.getElementById("easy");
const hard = document.getElementById("hard");

// Обработчики событий для радиокнопок выбора сложности
easy.addEventListener("change", () => {
    botDifficulty = "easy";
});

hard.addEventListener("change", () => {
    botDifficulty = "hard";
});

// Элементы интерфейса для выбора хода
const first = document.getElementById("first");
const second = document.getElementById("second");

// Обработчики событий для радиокнопок выбора сложности
first.addEventListener("change", () => {
    step = "first";
});

second.addEventListener("change", () => {
    step = "second";
});

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
            // Простой уровень: выбираем случайный ход из доступных
            botMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        } else {
            // Сложный уровень: использовать функцию findBestMove
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

        // Сохраняем текущее состояние игры в localStorage
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
    for (let i = 0; i < winningCombos.length; i++) {
        const combo = winningCombos[i];
        const cell1 = board[combo[0]];
        const cell2 = board[combo[1]];
        const cell3 = board[combo[2]];

        // Подсчитываем количество X и O в текущей комбинации
        const countX = [cell1, cell2, cell3].filter(cell => cell === 'X').length;
        const countO = [cell1, cell2, cell3].filter(cell => cell === 'O').length;

        // Проверяем, есть ли две O и одна пустая клетка
        if (countO === 2 && countX === 0) {
            // Находим индекс пустой клетки в текущей комбинации
            const emptyCellIndex = [cell1, cell2, cell3].indexOf('-');
            
            // Возвращаем индекс пустой клетки
            return combo[emptyCellIndex];
        }
    }
    for (let i = 0; i < winningCombos.length; i++) {
        const combo = winningCombos[i];
        const cell1 = board[combo[0]];
        const cell2 = board[combo[1]];
        const cell3 = board[combo[2]];

        // Подсчитываем количество X и O в текущей комбинации
        const countX = [cell1, cell2, cell3].filter(cell => cell === 'X').length;
        const countO = [cell1, cell2, cell3].filter(cell => cell === 'O').length;

        // Проверяем, есть ли две X и одна пустая клетка
        if (countX === 2 && countO === 0) {
            // Находим индекс пустой клетки в текущей комбинации
            const emptyCellIndex = [cell1, cell2, cell3].indexOf('-');
            
            // Возвращаем индекс пустой клетки
            return combo[emptyCellIndex];
        }
    }
    
    
    return -1; // Если не нашли подходящую комбинацию, возвращаем -1
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
        button.style.color = "black"; // Возвращаем черный цвет
    });
    
    // Определяем, кто будет ходить первым, исходя из выбора пользователя
    currentPlayer = step === "first" ? "X" : "O";

    // Опционально, можно также обновить отображение текущего игрока

    const selectedLevel = document.querySelector('input[name="level"]:checked');
    if (selectedLevel) {
        botDifficulty = selectedLevel.id;
    } else {
        // Если не выбрана, по умолчанию используем "easy"
        botDifficulty = "easy";
    }
    document.querySelector('.modal').classList.add('hidden');

    // Если первым ходит бот, вызываем функцию makeBotMove()
    if (currentPlayer === "O") {
        makeBotMove();
    }
}