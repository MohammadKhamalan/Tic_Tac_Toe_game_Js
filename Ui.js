const names = document.getElementById("active");
let turn = "X";
const cell = document.querySelectorAll(".cell");

const player1 = localStorage.getItem('player1') || "Player 1";
const player2 = localStorage.getItem('player2') || "Player 2";
const Easyy = localStorage.getItem('easy') || "easy";
const meduim = localStorage.getItem('Meduim') || "Meduim";
const Hard = localStorage.getItem('Hard') || "Hard";
names.textContent = `Player ${player1} turn`;

const huPlayer = 'X';
const aiPlayer = 'O';
cell.forEach(element => {
    element.addEventListener("click", () => {
        try{
        if (!element.textContent && (localStorage.getItem('gameMode') !== 'againstAi' || turn === "X")) {
            element.textContent = turn;
            turn = turn === "X" ? "O" : "X";
            element.style.display = "flex";
            element.style.alignItems = "center";
            element.style.justifyContent = "center";

            if (localStorage.getItem('gameMode') === 'againstAi') {
                if (turn === 'O') {
                    element.classList.add('ai-square');

        
                    names.textContent = `Ai's Turn`;
                    setTimeout(() => {
                         makeAIMove();
                            
                        names.textContent = `its my Turn`;
                    }, 1000);
                } else {
                    names.textContent = `Player ${player2} Turn`;
                }
            } else {
                if (turn === "X") {
                    names.textContent = `Player ${player1} Turn`;
                } else {
                    names.textContent = `Player ${player2} Turn`;
                }
            }
            
            
            checkwin();
        }}catch(error){}
    });
});

function makeAIMove() {
    try{
    if (localStorage.getItem('gameMode') === 'againstAi' && turn === 'O') {
        const emptyCells = [...cell].filter(cell => cell.textContent === '');

        if (emptyCells.length === 0) {
            return;
        }

        let move;
        const difficulty = localStorage.getItem('difficulty'); 
       
        if (difficulty === "easy") {

            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            emptyCells[randomIndex].textContent = 'O';
            emptyCells[randomIndex].classList.add('ai-square');

            turn = 'X';
            checkwin();
        } else if (difficulty === "Meduim") {
            move = bestMove(cell, 0, false);
        } else if (difficulty === "Hard") {
            move = makeHardAIMove();
        }

        if (move !== null) {
            cell[move].textContent = 'O'; 
            cell[move].classList.add('ai-square');

            turn = 'X';
            names.textContent = `Player ${player1} Turn`; 

            checkwin();
        }
    }}
    catch(error){}
}


function makeHardAIMove() {
    if (localStorage.getItem('gameMode') === 'againstAi' && turn === 'O') {
        const emptyCells = [...cell].filter(cell => cell.textContent === '');

        if (emptyCells.length === 0) {
            return;
        }

        const origBoard = Array.from(cell).map(element => element.textContent || '');
        const bestMoveIndex = minimaxHard(origBoard, aiPlayer).index;

        if (bestMoveIndex !== null) {
            cell[bestMoveIndex].textContent = aiPlayer;
            cell[bestMoveIndex].classList.add('ai-square');

            turn = 'X';
            checkwin(); 
        }
    }
}

function minimaxHard(board, player) {
    const availSpots = emptySquares(board);

    if (checkWin(board, player)) {
        return { score: player === aiPlayer ? 10 : -10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        board[availSpots[i]] = player;

        const result = minimaxHard(board, player === aiPlayer ? huPlayer : aiPlayer);
        move.score = result.score;

        board[availSpots[i]] = ''; 

        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}



function checkwin() {
    const state = [
        [0, 1, 2], [0, 3, 6], [0, 4, 8],
        [1, 4, 7], [2, 5, 8], [2, 4, 6],
        [6, 7, 8], [3, 4, 5]
    ];
    for (const item of state) {
        const [a, b, c] = item;
        if (cell[a].textContent && cell[a].textContent === cell[b].textContent && cell[a].textContent === cell[c].textContent) {
            if (cell[a].textContent === "X") {
                names.textContent = `Player ${player1} wins!`;
            } else if (cell[a].textContent === "O") {
                names.textContent = `Player AI wins!`;
            }
            setTimeout(() => {
                resetgame();
            }, 2000);
            return;
        }
    }
    if ([...cell].every(cells => cells.textContent)) {
        names.textContent = `Draw !`;
        setTimeout(() => {
            resetgame();
        }, 2000);
    }
}

function resetgame() {
    cell.forEach(cel => cel.textContent = "");
    if (turn === "X") {
        names.textContent = `Player ${player1} Turn!`;
    } else {
        names.textContent = `Player ${player2} Turn!`;
    }
}

function bestMove(board, depth, isMaximizing) {
    const emptyCells = [...board].filter(cell => cell.textContent === '');

    let bestScore = isMaximizing ? -Infinity : Infinity;
    let bestMove = null;
    for (const emptyCell of emptyCells) {
        const move = Array.from(board).indexOf(emptyCell);
        board[move].textContent = isMaximizing ? 'O' : 'X';
        let score = minimax(board, depth + 1, !isMaximizing);
        board[move].textContent = '';

        if ((isMaximizing && score > bestScore) || (!isMaximizing && score < bestScore)) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    const result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        let bestMove = null;
        for (let i = 0; i < board.length; i++) {
            if (board[i].textContent === '') {
                board[i].textContent = 'O';
                let score = minimax(board, depth + 1, false);
                board[i].textContent = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        if (depth === 0) {
            return bestMove;
        }
        return bestScore + depth * 10;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i].textContent === '') {
                board[i].textContent = 'X';
                let score = minimax(board, depth + 1, true);
                board[i].textContent = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore - depth * 10;
    }
}

const scores = {
    X: -10,
    O: 10,
    tie: 0
};

function checkWinner() {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (cell[a].textContent && cell[a].textContent === cell[b].textContent && cell[a].textContent === cell[c].textContent) {
            if (cell[a].textContent === "X") {
                names.textContent = `Player ${player1} wins!`;
            } else if (cell[a].textContent === "O") {
                names.textContent = `Player AI wins!`;
            }
            return cell[a].textContent;
            
            
        }
    }

    if ([...cell].every(cell => cell.textContent !== '')) {
        return 'tie';
    }

    return null;
}

function checkWin(board, player) {
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] === player && board[b] === player && board[c] === player) {

            return true;
        }
    }

    return false;
}



function bestSpot(board, player) {
    const availSpots = emptySquares(board);

    if (checkWin(board, player)) {
        return -10;
    } else if (checkWin(board, huPlayer)) {
        return 10;
    } else if (availSpots.length === 0) {
        return 0;
    }

    let bestScore = -Infinity;
    let bestMove = null;
    for (let i = 0; i < availSpots.length; i++) {
        board[availSpots[i]] = player;
        const score = minimax(board, 0, false);
        board[availSpots[i]] = ''; 

        if (score > bestScore) {
            bestScore = score;
            bestMove = availSpots[i];
        }
    }

    return bestMove;
}


function emptySquares(board) {
    return board.reduce((acc, currentValue, index) => {
        if (currentValue === '') {
            acc.push(index);
        }
        return acc;
    }, []);
}
    