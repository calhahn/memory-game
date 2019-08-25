/*
 * MEMORY GAME
 */

// Set array of symbols for the cards
const SYMBOLS = [
  'paper-plane-o',
  'paper-plane-o',
  'diamond',
  'diamond',
  'bicycle',
  'bicycle',
  'anchor',
  'anchor',
  'bolt',
  'bolt',
  'cube',
  'cube',
  'leaf',
  'leaf',
  'bomb',
  'bomb'
];

// Set some variables
let deck = document.getElementById('deck'),
    starOne = document.getElementById('star-1'),
    starTwo = document.getElementById('star-2'),
    moves = document.getElementById('moves'),
    elapsedTime = document.getElementById('time'),
    dialogBox = document.getElementById('dialog-box'),
    dialogMoves = document.getElementById('dialog-moves'),
    dialogTime = document.getElementById('dialog-time'),
    dialogRating = document.getElementById('dialog-rating'),
    isStarted = false,
    openCards = [],
    matched = 0,
    moveCounter = 0,
    rating = 3,
    countdown = 3000,
    autoHide,
    duration;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    [array[currentIndex], array[randomIndex]] =
        [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Initialize the deck of cards using a document fragment
function initDeck(array) {
  let docFrag = document.createDocumentFragment();
  shuffle(array); // Shuffle the array of symbols
  // Loop through the symbols and create the HTML for each card
  for (const symbol of array) {
    let card = document.createElement('li');
    card.className = 'card';
    card.innerHTML = `<i class= "fa fa-${symbol}"></i>`;
    docFrag.appendChild(card); // Add the card to the document fragment
  }
  deck.appendChild(docFrag); // Display the cards on the page
}

// Flip a card and store it in an array of open cards
function flip(card, array) {
  card.classList.add('show', 'open');
  array.push(card);
}

// Check if there is a pair of open cards
function isPair(array) {
  return array.length === 2;
}

// Check if two cards match
function isMatch(pairOfCards) {
  return pairOfCards[0].innerHTML === pairOfCards[1].innerHTML;
}

// Lock two matching cards
function lock(pairOfCards) {
  pairOfCards[0].classList.add('match');
  pairOfCards[1].classList.add('match');
}

// Hide two non-matching cards
function hide(pairOfCards) {
  pairOfCards[0].classList.remove('show', 'open');
  pairOfCards[1].classList.remove('show', 'open');
}

// Update the score
function updateScore(num) {
  if (num !== undefined) moveCounter = num; // Use -1 to reset moveCounter to 0
  moveCounter += 1;
  moves.textContent = moveCounter;
  if (moveCounter === 0) {
    // Reset time and rating
    elapsedTime.textContent = 0;
    starOne.classList.remove('hidden');
    starTwo.classList.remove('hidden');
    rating = 3;
  }
  if (moveCounter === 12) {
    // Reduce rating to two stars
    starOne.classList.add('hidden');
    rating = 2;
  }
  if (moveCounter === 16) {
    // Reduce rating to one star
    starTwo.classList.add('hidden');
    rating = 1;
  }
}

// Measure and update the game time
function countSeconds(t) {
  duration = setTimeout(() => {
    t += 1;
    elapsedTime.textContent = t;
    countSeconds(t);
  }, 1000);
}

// Set the final score data to display on the modal window
function setDialogData() {
  dialogMoves.textContent = moveCounter;
  dialogTime.textContent = elapsedTime.textContent;
  dialogRating.textContent = rating;
}

// Show the modal window
function showDialog() {
  dialogBox.showModal();
}

// Close the modal window
function closeDialog() {
  dialogBox.close();
}

// Handle the click events on the cards
function clickHandler(evt) {
  // Check if the click target is a card
  if (evt.target.nodeName === 'LI') {
    let card = evt.target;
    // Check if the card is not open
    if (!card.classList.contains('open')) {
      // Start the game clock when the first card is flipped
      if (!isStarted) {
        isStarted = true;
        countSeconds(0);
      }
      // Check if there aren't two open cards
      if (!isPair(openCards)) {
        flip(card, openCards);
        // Check if there are two open cards
        if (isPair(openCards)) {
          updateScore();
          // Check if the open cards match
          if (isMatch(openCards)) {
            // Lock matching open cards
            lock(openCards);
            openCards = [];
            matched += 2;
            // Check if all cards have matched
            if (matched === 16) {
              // Stop the game clock when the last card is flipped
              clearTimeout(duration);
              isStarted = false;
              // Show message with final score
              setTimeout(() => {
                setDialogData();
                showDialog();
              }, 500);
            }
          } else if (countdown !== undefined) {
            // Hide non-matching open cards after specified countdown
            autoHide = setTimeout(() => {
              hide(openCards);
              openCards = [];
            }, countdown);
          }
        }
      } else {
        // Hide non-matching open cards as soon as the next card is flipped
        clearTimeout(autoHide);
        hide(openCards);
        openCards = [];
        flip(card, openCards);
      }
    }
  }
}

// Reset all data and restart the game
function restart() {
  // Clear potentially running timeouts
  clearTimeout(autoHide);
  clearTimeout(duration);
  // Reset all data
  isStarted = false,
  openCards = [],
  matched = 0,
  updateScore(-1);
  // Reinitialize the deck
  deck.classList.add('hidden'); // Hide the deck
  while (deck.lastChild) {
    deck.removeChild(deck.lastChild); // Clear the deck
  }
  initDeck(SYMBOLS); // Initialize the deck
  deck.classList.remove('hidden'); // Show the deck
}

initDeck(SYMBOLS); // Display the cards on the page
deck.addEventListener('click', clickHandler); // Add the click event listener
