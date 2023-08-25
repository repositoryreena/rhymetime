const poemContainer = document.getElementById('poem');
const generateButton = document.getElementById('generateLine');
const userInput = document.getElementById('userInput');

const usedLastWords = [];

generateButton.addEventListener('click', generateLine);

async function generateLine() {
    const userLine = userInput.value.trim();
    if (!userLine) {
        alert("Please type your line first.");
        return;
    }

    const userLastWord = userLine.split(' ').pop();
    const previousLastWord = usedLastWords[usedLastWords.length - 1];

    if (previousLastWord && !(await checkRhyme(userLastWord, previousLastWord))) {
        alert("Your line doesn't rhyme with the previous line.");
        return;
    }

    // You write a line
    addLineToPoem(userLine);
    usedLastWords.push(userLastWord);

    // Computer generates a line
    let computerLine = await generateComputerLineRecursively();
    while (usedLastWords.includes(computerLine.split(' ').pop())) {
        computerLine = await generateComputerLineRecursively();
    }
    addLineToPoem(computerLine);
    usedLastWords.push(computerLine.split(' ').pop());

    userInput.value = "";
}

async function checkRhyme(word1, word2) {
    const response = await fetch(`https://api.datamuse.com/words?rel_rhy=${word1}`);
    const data = await response.json();
    return data.some(entry => entry.word === word2);
}

async function fetchRhyme(word) {
    const response = await fetch(`https://api.datamuse.com/words?rel_rhy=${word}`);
    const data = await response.json();
    const rhymeWords = data.map(entry => entry.word);
    return rhymeWords[Math.floor(Math.random() * rhymeWords.length)];
}

async function generateComputerLineRecursively() {
    let line = '';

    while (countWords(line) < 5 || countWords(line) > 10) {
        const rhymeWord = await fetchRhyme(usedLastWords[usedLastWords.length - 1]);
        if (!rhymeWord) {
            continue;
        }

        if (line) {
            line += ' ';
        }
        line += rhymeWord;
    }

    return line.trim() || "Couldn't find a rhyme for the computer's line.";
}

function countWords(sentence) {
    return sentence.split(' ').length;
}

function addLineToPoem(line) {
    const lineElement = document.createElement('div');
    lineElement.classList.add('poem-line');
    lineElement.textContent = line;
    poemContainer.appendChild(lineElement);
}
