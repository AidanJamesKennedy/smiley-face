let popularWords;
let allWords;
let guessNumber = 0;
let guesscount = document.getElementById("guesscount");

function loadGame() {
    Promise.all([
        fetch('./popular.txt')
            .then(response => response.text())
            .then(text => {
                popularWords = text.split("\r\n");
                popularWords.pop(); // Remove the '' at the end
            })
            .catch(error => {
                console.error('Error fetching words: ', error);
            }),
        fetch("./enable1.txt")
            .then(response => response.text())
            .then(text => {
                allWords = text.split("\r\n");
                allWords.pop(); // Remove the '' at the end
            })
            .catch(error => {
                console.error('Error fetching words: ', error);
            })]).finally(wordsLoaded);
}

let secret;
let popularWordsSorted = {};

function wordsLoaded() {
    console.log(`Loaded ${popularWords.length} popular words and ${allWords.length} dictionary words!`)
    for (var i=0; i < popularWords.length; i++){
        let word = popularWords[i];
        let len = word.length;
        if (popularWordsSorted[len] === undefined){
            popularWordsSorted[len] = [];
        }
        popularWordsSorted[len].push(word);
    }
    startGame();
}

let numLetters = 5;
function startGame(){
    // Get the array that contains words with numLetters
    let popularWordsLength = popularWordsSorted[numLetters];

    // Choose a random word from the array
    let randomIndex = randInt(0, popularWordsLength.length);
    secret = popularWordsLength[randomIndex];
}

let guessWord = document.getElementById("guess-word");
let guessHistory = document.getElementById("guess-history");
function makeGuess(){
    
    let guess = guessWord.value;
    if(guess.length !== numLetters) {
        return;
    }
    if(!allWords.includes(guess)) {
        guessWord.value = '';
        return;
    }
    guessNumber++;
    console.log(`Guess ${guess}`);
    let secretCopy = secret;
    for(let i = 0; i < numLetters; i++) {
        let letter = guess[i].toUpperCase();
        if(secret[i] === guess[i]) {
            guessHistory.innerHTML += `<span class='letter correct'>${letter}</span>`;
            secretCopy.replace(secret[i], "");
        } else if (secretCopy.includes(guess[i])) {
            guessHistory.innerHTML += `<span class='letter kindofcorrect'>${letter}</span>`;
            secretCopy.replace(guess[i], "");
        } else {
            guessHistory.innerHTML += `<span class='letter'>${letter}</span>`;
        }
    }
    guessHistory.innerHTML += `<br>`;
    guessWord.value = '';
    guesscount.innerHTML = "You have used " + guessNumber + " guesses";
}

function randInt(min, max) {
    let rand = Math.random();
    rand = rand * (max - min + 1);
    rand = rand + min;
    rand = Math.floor(rand);
    return rand;
}

function restartButton(){
    startGame();
    guesscount.innerHTML = "You haven't made a guess yet!"
    guessNumber = 0;
    guessHistory.innerHTML = "History: <br>";
}