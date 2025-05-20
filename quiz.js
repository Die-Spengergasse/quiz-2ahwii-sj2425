import { fragen } from "./fragen.js"; // Importiere die Fragen aus der JSON-Datei
globalThis.fragen = fragen; // Globales Array für die Fragen

class Frage {
    constructor(frage, optionen, antwort) {
        this.frage = frage;
        this.optionen = optionen;
        this.antwort = antwort;
    }

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

    // Neue Variablen für Kategorie- und Fragenanzahl-Container
    const categoryContainer = document.querySelector(".dropdown-container");
    const questionCountContainer = document.querySelector(".question-count-container");
    const questionCountInput = document.getElementById("question-count");

    let currentQuestionIndex = 0;
    let fragerichtig = 0;
    let fragefalsch = 0;
    let fragenObjekteKurz = [];

    function renderQuestion(frageObj) {
        questionText.textContent = frageObj.frage;
        optionsList.innerHTML = "";

        frageObj.optionen.forEach((option, index) => {
            const container = document.createElement("div");
            container.classList.add("option-container");

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "frageOption";
            radio.value = option;
            radio.id = `option-${index}`;

            radio.addEventListener("change", () => {
                weiterBtn.disabled = false;
            });

            const label = document.createElement("label");
            label.setAttribute("for", radio.id);
            label.textContent = option;

            container.appendChild(radio);
            container.appendChild(label);
            optionsList.appendChild(container);
        });

        questionNumber.textContent = `${currentQuestionIndex + 1}/${fragenObjekteKurz.length}`;
        weiterBtn.disabled = true;
    }

    startButton.addEventListener("click", () => {
        // Anzahl der Fragen aus Input holen
        let anzahlFragen = parseInt(questionCountInput.value);

        // Mindest- und Höchstwert prüfen (mindestens 2, max vorhandene Fragen)
        anzahlFragen = Math.min(Math.max(anzahlFragen, 2), fragenObjekte.length);

        // Fragen auf die gewünschte Anzahl kürzen
        fragenObjekteKurz = fragenObjekte.slice(0, anzahlFragen);

        // Dropdown und Eingabe ausblenden
        categoryContainer.classList.add("hidden");
        questionCountContainer.classList.add("hidden");

        // Startbutton ausblenden, Quiz anzeigen
        startButton.classList.add("hidden");
        questionContainer.classList.remove("hidden");
        weiterBtn.classList.remove("hidden");
        restartBtn.classList.remove("hidden");

        currentQuestionIndex = 0;
        fragerichtig = 0;
        fragefalsch = 0;

        renderQuestion(fragenObjekteKurz[currentQuestionIndex]);
    });

    weiterBtn.addEventListener("click", () => {
        const selected = document.querySelector('input[name="frageOption"]:checked');

        if (!selected) {
            // Weiterbutton deaktivieren, wenn nichts ausgewählt
            weiterBtn.disabled = true;
            return;
        }

        const userAnswer = selected.value;
        const currentFrage = fragenObjekteKurz[currentQuestionIndex];

        if (currentFrage.pruefen(userAnswer)) {
            fragerichtig++;
        } else {
            fragefalsch++;
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < fragenObjekteKurz.length) {
            renderQuestion(fragenObjekteKurz[currentQuestionIndex]);
        } else {
            alert(`Quiz beendet! Richtig: ${fragerichtig}, Falsch: ${fragefalsch}`);
            weiterBtn.classList.add("hidden");
        }
    });

    restartBtn.addEventListener("click", () => {
        // Alle Eingaben und Auswahlfelder wieder anzeigen
        categoryContainer.classList.remove("hidden");
        questionCountContainer.classList.remove("hidden");

        // Buttons und Quiz ausblenden
        startButton.classList.remove("hidden");
        questionContainer.classList.add("hidden");
        weiterBtn.classList.add("hidden");
        restartBtn.classList.add("hidden");

        currentQuestionIndex = 0;
        fragerichtig = 0;
        fragefalsch = 0;
    });
});
