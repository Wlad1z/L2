let board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
let currentPlayer = "X"; 
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
    localStorage.setItem("ticTacToeBoard", JSON.stringify(board));
    currentPlayer = "X";
    
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
        currentPlayer = "O"
    } else {
        currentPlayer = "X"
    }
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