const poemContainer = document.getElementById('poem');
const generateButton = document.getElementById('generateLine');
const userInput = document.getElementById('userInput');

const usedLastWords = new Set();

generateButton.addEventListener('click', generateLine);

async function generateLine() {
    const userLine = userInput.value.trim();
    if (!userLine) {
        alert("Please type your line first.");
        return;
    }

    const userLastWord = userLine.split(' ').pop();
    const previousLastWord = Array.from(usedLastWords).pop(); // Get the last word from the Set

    if (previousLastWord && !(await checkRhyme(userLastWord, previousLastWord))) {
        alert("Your line doesn't rhyme with the previous line.");
        return;
    }

    if (usedLastWords.has(userLastWord)) {
        alert("No repeating last words allowed.");
        return;
    }

    // You write a line
    addLineToPoem(userLine);
    usedLastWords.add(userLastWord);

    // Computer generates a line
    let computerLine = await generateComputerLineRecursively(userLastWord);
    while (usedLastWords.has(computerLine.split(' ').pop())) {
        computerLine = await generateComputerLineRecursively(userLastWord);
    }
    usedLastWords.add(computerLine.split(' ').pop());
    addLineToPoem(computerLine);

    userInput.value = "";
}

async function checkRhyme(word1, word2) {
    const response = await fetch(`https://api.datamuse.com/words?rel_rhy=${word1}`);
    const data = await response.json();
    return data.some(entry => entry.word === word2.toLowerCase());
}

async function fetchRhyme(word) {
    const response = await fetch(`https://api.datamuse.com/words?rel_rhy=${word}`);
    const data = await response.json();
    const rhymeWords = data.map(entry => entry.word);
    return rhymeWords[Math.floor(Math.random() * rhymeWords.length)];
}

async function generateComputerLineRecursively(lastWord) {
    let line = '';
    let currentWord = lastWord;

    while (countWords(line) < 5 || countWords(line) > 10 || usedLastWords.has(currentWord)) {
        const rhymeWord = await fetchRhyme(currentWord);

        if (line) {
            line += ' ';
        }
        line += rhymeWord;
        currentWord = rhymeWord;
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



function countWords(sentence) {
    return sentence.split(' ').length;
}

function addLineToPoem(line) {
    const lineElement = document.createElement('div');
    lineElement.classList.add('poem-line');
    lineElement.textContent = line;
    poemContainer.appendChild(lineElement);
}
