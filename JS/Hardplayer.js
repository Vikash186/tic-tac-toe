let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset-btn");
let newbtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let draw = document.querySelector(".draw");
let hide = document.querySelector(".hide");
let backBtn = document.querySelector("#backBtn");

// All Sounds
const touch = new Audio("sounds/box-click.mp3");
const drawSound = document.querySelector("#drawSound");
const winSound = document.querySelector("#winSound");
const newgameSound = document.querySelector("#newgamesound");

let count = 0;

// Winning Patterns(indexes)
const winpatterns = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],
];


// Checking the click on Boxes
boxes.forEach((box) =>{
    box.addEventListener("click", () =>{
        // Check if it's the player's turn
        if (!checkwinner() && count % 2 === 0) {
            count++;
            touch.play();
            
            box.innerText = "O";
            box.disabled = true;
            checkwinner();
            
            // If the game is not over and it's the computer's turn, make the computer move
            if (count < 9 && !checkwinner()) {
                setTimeout(() => {
                    computerMove();
                }, 500);
            }

            // Checks the draw condition
            if (count === 9 && !checkwinner()) {
                drawSound.play();
                draw.classList.remove("hide");
            }
        }
    });
});



// Minimax algorithm for determining the optimal move
const minimax = (board, depth, maximizingPlayer) => {
    // Base cases: check for terminal states
    let result = checkResult(board);
    if (result !== null) {
        return result === 'X' ? 10 - depth : result === 'O' ? depth - 10 : 0; // If AI wins, return a score of 10 - depth, if player wins, return depth - 10, else return 0 for a draw
    }

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                maxEval = Math.max(maxEval, minimax(board, depth + 1, false));
                board[i] = '';
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                minEval = Math.min(minEval, minimax(board, depth + 1, true));
                board[i] = '';
            }
        }
        return minEval;
    }
};


// Computer's move using minimax algorithm (Unbeatable)
const computerMove = () => {
    let bestMove = -1;
    let bestScore = -Infinity;
    let board = getCurrentBoardState();

    // Try to find a winning move first
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            if (checkResult(board) === 'X') {
                boxes[i].innerText = "X";
                touch.play();
                boxes[i].disabled = true;
                count++;
                checkwinner();
                return; // Return if found winning move
            }
            board[i] = ''; // Undo the move
        }
    }

    // If no winning move, try to find a blocking move for the player
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkResult(board) === 'O') {
                board[i] = 'X'; // Block the player
                boxes[i].innerText = "X";
                touch.play();
                boxes[i].disabled = true;
                count++;
                checkwinner();
                return; // Return if found blocking move
            }
            board[i] = ''; // Undo the move
        }
    }

    // If no winning or blocking move, proceed with the minimax algorithm
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    boxes[bestMove].innerText = "X";
    touch.play();
    boxes[bestMove].disabled = true;
    count++;
    checkwinner();
};


// Checking the Winning Condition
const checkwinner = () =>{
    for (let pattern of winpatterns) {    
        let pos1 = boxes[pattern[0]].innerText;
        let pos2 = boxes[pattern[1]].innerText;
        let pos3 = boxes[pattern[2]].innerText;

        if (pos1 !== "" && pos2 !== "" && pos3 !== "") {
            if (pos1 === pos2 && pos2 === pos3) {
                disableBoxes();
                winSound.play();

                // background color change after winning
                boxes[pattern[0]].style.backgroundColor = "#2C363F";
                boxes[pattern[1]].style.backgroundColor = "#2C363F";
                boxes[pattern[2]].style.backgroundColor = "#2C363F";

                showWinner(pos1);
                return true;
            }
        }
    }

    return false;
};

// Check for a draw
const checkDraw = () => {
    for (let box of boxes) {
        if (box.innerText === '') {
            return false;
        }
    }
    return true;
};

// Check the result of the game (win, lose, draw)
const checkResult = (board) => {
    for (let pattern of winpatterns) {
        let pos1 = board[pattern[0]];
        let pos2 = board[pattern[1]];
        let pos3 = board[pattern[2]];

        if (pos1 !== "" && pos2 !== "" && pos3 !== "") {
            if (pos1 === pos2 && pos2 === pos3) {
                return pos1;
            }
        }
    }

    if (checkDraw(board)) {
        return 'draw';
    }

    return null;
};

// Get the current state of the board
const getCurrentBoardState = () => {
    let board = [];
    for (let box of boxes) {
        board.push(box.innerText);
    }
    return board;
};

// Displaying the Winner
const showWinner = (winner) => {
    winSound.play();
    wait(1.15)
    .then(() => {
        msg.innerText = `Congratulation, Winner is ${winner}`;
        msgContainer.classList.remove("hide");
    });
};

//Wait Function to wait after a win
function wait(seconds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000); // Convert seconds to milliseconds
    });
}

// After displaying the winner, disable all boxes
const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

// When a New Game starts, all boxes should be enabled
const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

// Reset Game Function
const resetGame = () => {
    newgameSound.play();
    enableBoxes();
    msgContainer.classList.add("hide");
    draw.classList.add("hide");
    count = 0;
    // After winning, the color back to previous
    boxes.forEach((box) => {
        box.style.backgroundColor = "#F2F5EA";
    });
};

const backbtn = () =>{
    window.location.replace("index.html");
};

// When "New Game"/"Reset Game" btn clicked then reset the game
newbtn.addEventListener("click", resetGame);
resetbtn.addEventListener("click", resetGame);
backBtn.addEventListener("click", backbtn);
