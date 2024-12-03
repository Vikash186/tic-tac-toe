let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset-btn");
let newbtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let draw = document.querySelector(".draw");
let hide = document.querySelector(".hide");
let backBtn = document.querySelector("#backBtn");

//All Sounds
const touch = document.querySelector("#click");
const drawSound = document.querySelector("#drawSound");
const winSound = document.querySelector("#winSound");
const newgameSound = document.querySelector("#newgamesound");

let turnO = true; // Player O

let count = 0;


//Winning Patterns(indexes)
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

//Checking the click on Boxes
boxes.forEach((box) =>{
    box.addEventListener("click", () =>{
        count ++;

        touch.play();
        
        if(turnO){
            box.innerText = "O";
            turnO = false;
        }
        else{
            box.innerText = "X";
            turnO = true;
        }
        box.disabled = true;

        //Checks the draw condition
        let iswinner = checkwinner();
        if(count === 9 && !iswinner){
            drawSound.play();
            draw.classList.remove("hide");
        }
    });

});

//Checking the Winning Condition
const checkwinner = () =>{
    for(let pattern of winpatterns){    
        let pos1 = boxes[pattern[0]].innerText;
        let pos2 = boxes[pattern[1]].innerText;
        let pos3 = boxes[pattern[2]].innerText;

        if(pos1 != "" && pos2 != "" && pos3 != ""){
            if(pos1 === pos2 && pos2 === pos3){
                disableBoxes();
                winSound.play();

                //background color change after winning
                boxes[pattern[0]].style.backgroundColor = "#2C363F";
                boxes[pattern[1]].style.backgroundColor = "#2C363F";
                boxes[pattern[2]].style.backgroundColor = "#2C363F";

                showWinner(pos1);
                return true;
            }
        }
    }
};

//Wait Function to wait after a win
function wait(seconds) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000); // Convert seconds to milliseconds
    });
}

//Displaying the Winner
const showWinner = (winner) => {
    winSound.play();
    wait(1.2)
    .then(() => {
        msg.innerText = `Congratulation, Winner is ${winner}`;
        msgContainer.classList.remove("hide");
    })
};

//After displaying the winner disabled all btns
const disableBoxes = () => {
    for(let box of boxes){
        box.disabled = true;
    }
};

//when a New Game start, all boxes should be enabled
const enableBoxes = () => {
    for(let box of boxes){
        box.disabled = false;
        box.innerText = "";
    }
};

//Reset Game Function
const resetGame = () => {
    newgameSound.play();
    turnO = true;
    enableBoxes();
    msgContainer.classList.add("hide");
    draw.classList.add("hide");
    count = 0;
    //after win the color back to previous
    boxes.forEach((box) => {
        box.style.backgroundColor = "#F2F5EA";
    });
};

const backbtn = () =>{
    window.location.replace("index.html");
}

//When "New Game"/"Reset Game" btn clicked then reset the game
newbtn.addEventListener("click", resetGame);
resetbtn.addEventListener("click", resetGame);
backBtn.addEventListener("click", backbtn);

