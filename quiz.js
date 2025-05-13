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
    const questionNumber = document.getElementById("question-number");

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
    }

    startButton.addEventListener("click", () => {
        startButton.classList.add("hidden");
        questionContainer.classList.remove("hidden");
        weiterBtn.classList.remove("hidden");

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

        renderQuestion(fragenObjekte[currentQuestionIndex]);
    });
});
