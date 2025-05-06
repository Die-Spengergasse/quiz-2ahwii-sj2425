const frageText = document.getElementById("frage-text");
const optionenContainer = document.getElementById("optionen-container");
const weiterBtn = document.getElementById("weiter-btn");
const counter = document.getElementById("counter");

let aktuelleFrageIndex = 0;
let antwortRichtig = false;
let score = 0;

function ladeFrage() {
  const frage = fragen[aktuelleFrageIndex];
  frageText.textContent = frage.frage;
  optionenContainer.innerHTML = "";
  weiterBtn.disabled = true;
  antwortRichtig = false;

  frage.optionen.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option");

    button.addEventListener("click", () => überprüfeAntwort(button, frage.antwort));
    optionenContainer.appendChild(button);
  });
}

function überprüfeAntwort(button, richtigeAntwort) {
  const alleOptionen = document.querySelectorAll(".option");

  if (button.textContent === richtigeAntwort) {
    button.classList.add("correct");
    antwortRichtig = true;
    weiterBtn.disabled = false;
    alleOptionen.forEach((btn) => (btn.disabled = true));
    score++;
  } else {
    button.classList.add("incorrect");
    button.disabled = true;
    score--;
  }
}

weiterBtn.addEventListener("click", () => {
  if (!antwortRichtig) return;
  aktuelleFrageIndex++;
  if (aktuelleFrageIndex < fragen.length) {
    ladeFrage();
    counter.textContent = `Frage ${aktuelleFrageIndex + 1} von ${fragen.length}`;
  } else {
    frageText.textContent = "Du hast alle Fragen beantwortet! und dein Score ist: " + score;
    optionenContainer.innerHTML = "";
    weiterBtn.style.display = "none";
  }
});

ladeFrage();