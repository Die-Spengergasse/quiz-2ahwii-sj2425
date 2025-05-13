// Klasse Frage erstellen
import { fragen } from "./fragen.js"; // Importiere die Fragen aus der JSON-Datei
globalThis.fragen = fragen; // Globales Array für die Fragen
class Frage {
    constructor(frage, optionen, antwort) {
        this.frage = frage;
        this.optionen = optionen;
        this.antwort = antwort;
    }

    // Methode zum Anzeigen der Frage und der Optionen
    /*anzeigen() {
        console.log(`Frage: ${this.frage}`);
        console.log("Optionen:");
        this.optionen.forEach((option, index) => {
            console.log(`${index + 1}. ${option}`);
        });
    }*/

    // Methode zum Prüfen der Antwort
    pruefen(antwort) {
        return this.antwort === antwort;
    }
}

const fragenObjekte = fragen.map((e) =>
    new Frage(e.frage, e.optionen, e.antwort)
);

// Beispiel: Jede Frage anzeigen
/*fragenObjekte.forEach((frage, index) => {
    console.log(`Frage ${index + 1}:`);
    frage.anzeigen();
    console.log("---");
});*/

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const questionContainer = document.getElementById("question-container");
    const questionText = document.getElementById("question");
    const optionsList = document.getElementById("options");
    const weiterBtn = document.getElementById("weiter-btn");    //neu
    let currentQuestionIndex = 0;       //neu

    function renderQuestion(frageObj) {
        questionText.textContent = frageObj.frage;
        optionsList.innerHTML = "";

        frageObj.optionen.forEach(option => {
            const li = document.createElement("li");
            li.textContent = option;
            optionsList.appendChild(li);
        });
    }

    startButton.addEventListener("click", () => {
        startButton.classList.add("hidden");
        questionContainer.classList.remove("hidden");
        weiterBtn.classList.remove("hidden");       //neu
        renderQuestion(fragenObjekte[currentQuestionIndex]);        //anders
    });
    //neu:
    weiterBtn.addEventListener("click", () => {
        currentQuestionIndex++;
        renderQuestion(fragenObjekte[currentQuestionIndex]);
    })
});
