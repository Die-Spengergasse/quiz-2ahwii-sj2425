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

    let currentQuestionIndex = 0;
    let fragerichtig = 0;
    let fragefalsch = 0;

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

    startButton.addEventListener("click", () => {
        startButton.classList.add("hidden");
        questionContainer.classList.remove("hidden");
        weiterBtn.classList.remove("hidden");
        restartBtn.classList.remove("hidden");
        correctCountElement.textContent = `Correct: ${fragerichtig}`;
        wrongCountElement.textContent = `Wrong: ${fragefalsch}`;
        renderQuestion(fragenObjekte[currentQuestionIndex]);
    });

    weiterBtn.addEventListener("click", () => {
        const selected = document.querySelector('input[name="frageOption"]:checked');

        if (!selected) {
            weiterBtn.disabled = true;
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
        if (currentQuestionIndex < fragenObjekte.length) { // es gibt noch (zumindest) diese Frage
            renderQuestion(fragenObjekte[currentQuestionIndex]);
        }else {
     
            questionContainer.innerHTML =
                `<h2>Quiz Finished!</h2><p>Sie haben ${fragerichtig} Fragen richtig und ${fragefalsch} fragen falsch.</p>`;
            weiterBtn.classList.add("hidden");        
        }
    });

    restartBtn.addEventListener("click", () => {
        currentQuestionIndex = 0;
        fragerichtig = 0; 
        fragefalsch = 0;
        correctCountElement.textContent = `richtig: ${fragerichtig}`;
        wrongCountElement.textContent = `falsch: ${fragefalsch}`;
        questionNumber.textContent = `1/${fragenObjekte.length}`;
        renderQuestion(fragenObjekte[currentQuestionIndex]);
    });
});