let current = 0;
let score = 0;
let order = [];
let seen = new Set();
let rounds = [];
let imagesLoaded = 0;
let canClick = false;

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
  
  canClick = false;
  imagesLoaded = 0;
  
  showLoadingMessage();
  
  const pairId = getRandomPair();
  const iaFirst = Math.random() < 0.5;
  const pair = {
    id: pairId,
    correct: iaFirst ? 1 : 0
  };
  order[current] = pair;

  document.getElementById("pairIndex").textContent = current + 1;
  
  const img1 = document.getElementById("img1");
  const img2 = document.getElementById("img2");
  
  img1.style.cursor = "not-allowed";
  img2.style.cursor = "not-allowed";
  img1.style.opacity = "0.5";
  img2.style.opacity = "0.5";
  
  img1.onload = imageLoaded;
  img2.onload = imageLoaded;
  
  const mappingEntry = imageMapping[pairId];
  if (!mappingEntry) {
    console.error(`No mapping found for pair ${pairId}`);
    return;
  }
  
  img1.src = `assets/${iaFirst ? mappingEntry.b : mappingEntry.a}`;
  img2.src = `assets/${iaFirst ? mappingEntry.a : mappingEntry.b}`;
}

function makeChoice(choice) {
  if (!canClick) return;
  
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

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 2) {
    hideLoadingMessage();
    const img1 = document.getElementById("img1");
    const img2 = document.getElementById("img2");
    img1.style.cursor = "pointer";
    img2.style.cursor = "pointer";
    img1.style.opacity = "1";
    img2.style.opacity = "1";
    canClick = true;
  }
}

function showLoadingMessage() {
  const loadingMsg = document.getElementById("loadingMessage");
  if (loadingMsg) {
    loadingMsg.style.display = "block";
  }
}

function hideLoadingMessage() {
  const loadingMsg = document.getElementById("loadingMessage");
  if (loadingMsg) {
    loadingMsg.style.display = "none";
  }
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
    const mappingEntry = imageMapping[round.id];
    img1.src = `assets/${iaFirst ? mappingEntry.b : mappingEntry.a}`;

    const img2 = document.createElement("img");
    img2.src = `assets/${iaFirst ? mappingEntry.a : mappingEntry.b}`;

    const userWasCorrect = (round.user === round.correct);

    if (userClickedFirst) {
      img1.classList.add(userWasCorrect ? "user-correct" : "user-wrong");
    } else {
      img2.classList.add(userWasCorrect ? "user-correct" : "user-wrong");
    }

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
