// Klasse Frage erstellen
import { fragen } from "./fragen.js"; // Importiere die Fragen aus der JSON-Datei
globalThis.fragen = fragen; // Globales Array für die Fragen

class Frage {
    constructor(frage, optionen, antwort) {
        this.frage = frage;
        this.optionen = optionen;
        this.antwort = antwort;
    }

    // Methode zum Prüfen der Antwort
    pruefen(antwort) {
        return this.antwort === antwort;
    }
}

const fragenObjekte = fragen.map((e) =>
    new Frage(e.frage, e.optionen, e.antwort)
);

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const questionContainer = document.getElementById("question-container");
    const questionText = document.getElementById("question");
    const optionsList = document.getElementById("options");
    const weiterBtn = document.getElementById("weiter-btn");
    const restartBtn = document.getElementById("restart-btn");
    const questionNumber = document.getElementById("question-number");
    
    const correctCountElement = document.getElementById("correct-count");
    const wrongCountElement = document.getElementById("wrong-count");
    const timerDisplay = document.getElementById("timer");

    let currentQuestionIndex = 0;
    let fragerichtig = 0;
    let fragefalsch = 0;

    // Timer-Variablen (korrekter Name)
    let timerInterval = null;
    let startTime = 0;

    // Timer starten
    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            timerDisplay.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Timer stoppen
    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        timerDisplay.textContent = "00:00";
    }

    // Timer zurücksetzen und starten
    function resetTimer() {
        stopTimer();
        startTimer();
    }

    // Frage rendern
    function renderQuestion(frageObj) {
        questionText.textContent = frageObj.frage;
        optionsList.innerHTML = "";

        frageObj.optionen.forEach((option, index) => {
            const container = document.createElement("div"); // Wrapper für Radio + Label
            container.classList.add("option-container");

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "frageOption";
            radio.value = option;
            radio.id = `option-${index}`;

            const label = document.createElement("label");
            label.setAttribute("for", radio.id);
            label.textContent = option;

            container.appendChild(radio);
            container.appendChild(label);
            optionsList.appendChild(container);
        });

        questionNumber.textContent = `${currentQuestionIndex + 1}/${fragenObjekte.length}`;
        correctCountElement.textContent = `Correct: ${fragerichtig}`;
        wrongCountElement.textContent = `Wrong: ${fragefalsch}`;
    }

    // Quiz starten
    startButton.addEventListener("click", () => {
        startButton.classList.add("hidden");
        questionContainer.classList.remove("hidden");
        weiterBtn.classList.remove("hidden");
        restartBtn.classList.remove("hidden");
        renderQuestion(fragenObjekte[currentQuestionIndex]);
        resetTimer(); // Timer starten
    });

    // Nächste Frage
    weiterBtn.addEventListener("click", () => {
        const selected = document.querySelector('input[name="frageOption"]:checked');

        if (!selected) {
            weiterBtn.disabled = true;
            return; // Kein Ergebnis ausgewählt, Button deaktiviert und nichts weiter tun
        }

        weiterBtn.disabled = false;

        const userAnswer = selected.value;
        const currentFrage = fragenObjekte[currentQuestionIndex];

        if (currentFrage.pruefen(userAnswer)) {
            fragerichtig++;
        }
        else {
            fragefalsch++;
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < fragenObjekte.length) { // Es gibt noch Fragen
            renderQuestion(fragenObjekte[currentQuestionIndex]);

        }else {
     
            questionContainer.innerHTML =
                `<h2>Quiz Finished!</h2><p>Sie haben ${fragerichtig} Fragen richtig und ${fragefalsch} fragen falsch.</p>`;
            weiterBtn.classList.add("hidden");  
            stopTimer(); // Quiz Ende - Timer stoppen
      
        }
    });

    // Quiz neu starten
    restartBtn.addEventListener("click", () => {
        currentQuestionIndex = 0;

        fragerichtig = 0; 
        fragefalsch = 0;
        correctCountElement.textContent = `richtig: ${fragerichtig}`;
        wrongCountElement.textContent = `falsch: ${fragefalsch}`;

        fragerichtig = 0;
        fragefalsch = 0;

        questionNumber.textContent = `1/${fragenObjekte.length}`;
        renderQuestion(fragenObjekte[currentQuestionIndex]);
        resetTimer(); // Timer zurücksetzen und starten
    });
});
