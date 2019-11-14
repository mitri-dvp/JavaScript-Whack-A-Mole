// Elements
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.moles');
const counter = document.querySelector('.counter');
const start = document.querySelector('h1');
const timer = document.querySelector('.timer');
let count = 0;
let lastHole;
let timeUp;
let time = 0;
let started = false;

const scoreboard = document.querySelector('.scoreboard');
const nameContainer = document.querySelector('.enterName');
const nameInput = document.querySelector('input[type=text]');
const table = document.querySelector('.scores');
const scoreBtn = document.querySelector('.score-button');
let scoreboardTable;
if (localStorage.getItem('scoreboard')) {
  scoreboardTable = JSON.parse(localStorage.getItem('scoreboard'));
} else {
  scoreboardTable = [];
}
let finalScore;
let name;
const n = 0;
// Event Listeners
start.addEventListener('mousemove', changeText);
start.addEventListener('mouseout', revertText);
start.addEventListener('click', startTime);
start.addEventListener('touchmove', changeText);
start.addEventListener('touchend', revertText);
start.addEventListener('touchstart', startTime);
holes.forEach(hole => hole.addEventListener('mousedown', up));
holes.forEach(hole => hole.addEventListener('touchstart', up));
nameInput.addEventListener('keyup', enterName);
scoreBtn.addEventListener('click', goMenu);

// Functions
function up(e) {
  e.preventDefault();
  if (this.classList.contains('up')) {
    this.classList.remove('up');
    count++;
    counter.textContent = `${count}`;
  }
}
function peep() {
  const time = randomTime(400, 1500);
  const hole = randomHole(holes);
  hole.classList.add('up');
  setTimeout(() => {
    if (!timeUp) peep();
    hole.classList.remove('up');
  }, time);
}
function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}
function randomHole(holes) {
  // Get me a Random DOM elements
  const index = Math.floor(Math.random() * holes.length);
  const hole = holes[index];
  if (lastHole === hole) {
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

function changeText() {
  start.textContent = 'Start';
  start.classList.add('active');
}
function revertText() {
  start.textContent = 'Wack-A-Mole';
  start.classList.remove('active');
}
function startTime() {
  if (started === false) {
    counter.textContent = '0';
    count = 0;
    timeUp = false;
    time = 0;
    started = true;
    timer.textContent = `Time: 10`;
    peep();
    countdown = setInterval(() => {
      time++;
      timer.textContent = `Time: ${10 - time}`;
      if (time >= 10) {
        clearInterval(countdown);
        timeUp = true;
        started = false;
        setTimeout(() => {
          scoreboardUpdater();
        }, 1000);
      }
    }, 1000);
  }
}
// Extra Stuff

function scoreboardUpdater() {
  finalScore = count;
  nameContainer.classList.add('flex');
  setTimeout(() => {
    nameContainer.classList.add('opacity');
  }, 100);
}
function enterName(e) {
  if (e.keyCode === 13) {
    name = this.value;
    this.value = '';
    nameContainer.classList.remove('flex');
    nameContainer.classList.remove('opacity');
    scoreboard.classList.add('block');
    scoreboard.classList.add('opacity');
    scoreboardTable.push({ name, score: finalScore });
    localStorage.setItem('scoreboard', JSON.stringify(scoreboardTable));
    sortedScoreTable = scoreboardTable.sort((a, b) => (a.score > b.score ? -1 : 1));
    table.innerHTML = `
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
            `;
    for (let i = 0; i < sortedScoreTable.length; i++) {
      if (i > 7) {
        return;
      }
      table.innerHTML += `
      <tbody>
        <td>${i + 1}</td>
        <td>${sortedScoreTable[i].name}</td>
        <td>${sortedScoreTable[i].score}</td>
      </tbody>
      `;
    }
  }
}

function goMenu() {
  scoreboard.classList.remove('block');
  scoreboard.classList.remove('opacity');
}
