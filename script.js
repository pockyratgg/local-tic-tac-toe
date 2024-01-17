//audio controller
class AudioController {
    constructor() {
        this.xSound = new Audio('assets/xPopSound.wav');
        this.circleSound = new Audio('assets/circlePopSound.mp3');
        this.victorySound = new Audio('assets/victorySound.wav');
        this.drawSound = new Audio('assets/tieSound.wav');
        this.themeMusic = new Audio('assets/2018-08-02-17971.mp3');
        this.themeMusic.volume = 0.5;
        this.themeMusic.loop = true;
    }

    //sounds are defined here in AudioController but not being called anywhere yet
    playXSound() {
        this.xSound.play();
    }

    playCircleSound() {
        this.circleSound.play();
    }

    stopXSound() {
        this.xSound.pause();
    }
    stopCircleSound() {
        this.circleSound.pause();
    }

    playvictorySound() {
        this.victorySound.play();

    }

    playdrawSound() {
        this.drawSound.play();
    }

    playthemeMusic() {
        this.themeMusic.play();
    }

    stopthemeMusic() {
        this.themeMusic.pause();
        this.themeMusic.currentTime = 0;
    }

} //end of audio class

this.audioController = new AudioController;

const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
//creating an array for all the winning combinations which is going to be an array full of arrays
//examples would be if you have the same element in spots 1, 2, 3 you would be a winner or the same element in 1, 3, and 7, you would be a winner (but 0 indexed)
const WINNING_COMBINATIONS = [
    [0, 1, 2], //horizontal  combos
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], //vertical combos
    [1, 4, 7],
    [2, 5, 8], 
    [0, 4, 8], //diagonal combos
    [2, 4, 6 ],
]
//first thing we want to do is select all of the cells
const cellElements = document.querySelectorAll('[data-cell')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const restartButton = document.getElementById('restartButton')
let circleTurn //if variable is true, its circle's turn, if false, its x's turn

const xMessageTurn = document.getElementById('xTurn');
const circleMessageTurn = document.getElementById('circleTurn');

//start message overlay variables from html
const startMessageElement = document.getElementById('startMessage')
const startMessageTextElement = document.querySelector('[data-start-message-text]')
const startButton = document.getElementById('startButton')

//grabbing our message from html
const msg = document.querySelector('.message')

//shows our start overlay
startMessageElement.classList.add('show')
startMessageTextElement.innerText = "Let's Play Tic-Tac-Toe!"
startButton.addEventListener('click', startGame)

//local play message overlay variables from html
const localMessageElement = document.getElementById('localMessage')
const localMessageTextElement = document.querySelector('[data-local-message-text]')
const localButton = document.getElementById('localButton')

//we can select a click event listener for the restart button. every time we click on the button, we want to call our start game function
restartButton.addEventListener('click', startGame)

//creating a function to show which person's turn it is from the very beginning
function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {

        //removes X's and O's event listener after restart
        cell.classList.remove(X_CLASS)
        cell.classList.remove(CIRCLE_CLASS)
        startMessageElement.classList.remove('show') //IMPORTANT FOR START MESSAGE. removes start overlay once the game starts
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, { once: true })
    })
    setBoardHoverClass()
    //need to unset everything up, remove all X's and O's that were already placed for the next game. this removes the overlay after clicking restart
    winningMessageElement.classList.remove('show')
}

//e is the event
function handleClick(e) {
    const cell = e.target //target is whatever we clicked on

    //if its circle's turn, then we want to return the circle class, otherwise we want to return the X class
    const currentClass = circleTurn ? CIRCLE_CLASS: X_CLASS

    placeMark(cell, currentClass)

    //checking for a win
    if (checkWin(currentClass)) {

        endGame(false) //this will be for whether or not its a draw
    } else if (isDraw()) {
        endGame(true)
    } else {

        //check for draw
        //switch turns
        swapTurns()
        setBoardHoverClass()
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = 'Draw!'
        this.audioController.playdrawSound();
        this.audioController.stopthemeMusic();
        
    } else {
        //if circle wins, then we want to say the O's win or if X's we want to put x's win
        winningMessageTextElement.innerText = `${circleTurn ? "Circle" : "X"} Wins!`
        this.audioController.playvictorySound();
        this.audioController.stopthemeMusic();
    }
    winningMessageElement.classList.add('show') //adding a show class in here
}

//draw function. checking to see if every cell has been filled first. get every cell and check if it has a class, either an X class or a O class
//one issue with this is that cellElements does not have an 'every method' but to get around it we can destructure the cell elements into an array and it'll then have the method
function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    })
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass)
}

//this function is simple and take's circle's turn and sets it to the opposite of circle turn which is x's turn
function swapTurns() {
    circleTurn = !circleTurn
}

//this function determines which class we apply for the hover. we make sure we swap turns, so we know which player's turn it currently is instead of the previous player's turn
//board is grabbed above by using getElementById above
//remove X class and remove O class so there are no classes currently on it
//then if circle turn, add circle class or if x turn, add x class
function setBoardHoverClass() {
    this.audioController.playthemeMusic();
    board.classList.remove(X_CLASS)
    board.classList.remove(CIRCLE_CLASS)

    //if circle turn currently, add in circle class
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS)
        this.audioController.playCircleSound();
        msg.textContent = 'Circle, click on a space to make your move!';
    } else {
        board.classList.add(X_CLASS)
        this.audioController.playXSound();
        msg.textContent = 'X, click on a space to make your move!';
    }

}

//check all the winning combinations to see if some of the winning combinations are met by the current combinations. loops over all the different combinations in the array
//will return true if any of the values inside of it are true for using .some. for each one of the combinations, we want to check if all of the indexes or all the values of our cell elements have the same class
//if current class in all three of the elements inside of one of the combinations, then there is a winner
function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains
            (currentClass)
        })
    }) 
}