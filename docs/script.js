let current = 0;
let score = 0;
let order = [];
let seen = new Set();
let rounds = [];

function startGame() {
  current = 0;
  score = 0;
  order = [];
  rounds = [];
  seen = new Set();
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("result").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  loadNext();
}

function getRandomPair() {
  let id;
  do {
    id = Math.floor(Math.random() * 31);
  } while (seen.has(id));
  seen.add(id);
  return id.toString().padStart(3, '0');
}

function loadNext() {
  if (current >= 10) return showResult();
  const pairId = getRandomPair();
  const iaFirst = Math.random() < 0.5;
  const pair = {
    id: pairId,
    correct: iaFirst ? 1 : 0
  };
  order[current] = pair;

  document.getElementById("pairIndex").textContent = current + 1;
  document.getElementById("img1").src = `assets/${pairId}_${iaFirst ? 'b' : 'a'}.png`;
  document.getElementById("img2").src = `assets/${pairId}_${iaFirst ? 'a' : 'b'}.png`;
}

function makeChoice(choice) {
  const pair = order[current];
  const correct = pair.correct;
  const success = (choice === correct);
  if (success) score++;
  rounds.push({
    id: pair.id,
    user: choice,
    correct: correct
  });
  current++;
  loadNext();
}

function showResult() {
  document.getElementById("game").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("score").textContent = score;

  const recap = document.getElementById("recap");
  recap.innerHTML = "";
  rounds.forEach((round, index) => {
    const iaFirst = (round.correct === 1);
    const userClickedFirst = (round.user === 0);

    const pairDiv = document.createElement("div");
    pairDiv.className = "recap-pair";

    const img1 = document.createElement("img");
    img1.src = `assets/${round.id}_${iaFirst ? 'b' : 'a'}.png`;
    if (iaFirst) img1.classList.add("ia");

    const img2 = document.createElement("img");
    img2.src = `assets/${round.id}_${iaFirst ? 'a' : 'b'}.png`;
    if (!iaFirst) img2.classList.add("ia");

    if ((iaFirst && round.user === 1) || (!iaFirst && round.user === 0)) {
      pairDiv.classList.add("correct");
    } else {
      pairDiv.classList.add("wrong");
    }

    pairDiv.appendChild(img1);
    pairDiv.appendChild(img2);
    recap.appendChild(pairDiv);
  });
}
