// Klasse Frage erstellen
import { fragen } from "./fragen.js"; // Importiere die Fragen aus der JSON-Datei
globalThis.fragen = fragen; // Globales Array für die Fragen

import { Frage } from "./frage.js"; // Importiere die Klasse Frage

class App {
    constructor() {
        this.d = {
            startpage: document.getElementById("startpage"),
            startButton: document.getElementById("start-button"),
            categoryDropdown: document.getElementById("category"),
            hardness_select: document.getElementById("hardness"),
            howmany: document.getElementById("howmany"),
            questionContainer: document.getElementById("question-container"),
            questionText: document.getElementById("question"),
            optionsList: document.getElementById("options"),
            weiterBtn: document.getElementById("weiter-btn"),
            restartBtn: document.getElementById("restart-btn"),
            questionNumber: document.getElementById("question-number"),
            endcontainer: document.getElementById("endcontainer"),
            correctCountElement: document.getElementById("correct-count"),
            wrongCountElement: document.getElementById("wrong-count"),
            timerDisplay: document.getElementById("timer"),
        };
        this.state = {
            currentQuestionIndex: 0,
            fragerichtig: 0,
            fragefalsch: 0,
        };
        this.fragenObjekte = fragen.map((e) =>
            new Frage(
                e.frage,
                e.optionen.toSorted(() => Math.random() - 0.5),
                e.antwort,
            )
        ).toSorted(() => Math.random() - 0.5);
        this.init();
    }
    get_api_url(category, difficulty, count) {
        return `https://opentdb.com/api.php?amount=${count}&category=${category}&difficulty=${difficulty}&type=multiple`;
    }
    show_endpage() {
        this.d.startpage.classList.add("hidden");
        this.d.questionContainer.classList.add("hidden");
        this.d.endcontainer.classList.remove("hidden");
    }
    // Timer starten
    startTimer() {
        this.state.startTime = Date.now();
        this.state.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.state.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            this.d.timerDisplay.textContent = `${
                minutes.toString().padStart(2, "0")
            }:${seconds.toString().padStart(2, "0")}`;
        }, 1000);
    }

    // Timer stoppen
    stopTimer() {
        clearInterval(this.state.timerInterval);
        this.state.timerInterval = null;
        this.d.timerDisplay.textContent = "00:00";
    }

    // Timer zurücksetzen und starten
    resetTimer() {
        this.stopTimer();
        this.startTimer();
    }

    // Frage rendern
    renderQuestion() {
        const frageObj = this.fragenObjekte[this.state.currentQuestionIndex];
        this.d.questionText.innerHTML = frageObj.frage;
        this.d.optionsList.innerHTML = "";

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
            label.innerHTML = option;

            container.appendChild(radio);
            container.appendChild(label);
            this.d.optionsList.appendChild(container);
        });

        this.d.questionNumber.textContent = `${
            this.state.currentQuestionIndex + 1
        }/${this.fragenObjekte.length}`;
        this.d.correctCountElement.textContent =
            `Correct: ${this.state.fragerichtig}`;
        this.d.wrongCountElement.textContent =
            `Wrong: ${this.state.fragefalsch}`;

        if (this.state.currentQuestionIndex === this.fragenObjekte.length - 1) {
            this.d.weiterBtn.textContent = "Quiz beenden";
        } else {
            this.d.weiterBtn.textContent = "Nächste Frage";
        }
    }

    // Quiz starten
    init() {
        this.d.startButton.addEventListener(
            "click",
            this.start.bind(this),
        );
        this.d.weiterBtn.addEventListener(
            "click",
            this.weiter.bind(this),
        );
        this.d.restartBtn.addEventListener(
            "click",
            this.restart.bind(this),
        );
        this.restart();
    }

    // übergang von startpage zum spiel
    // this.fragenObjekte ist bereits da

    async start() {
        this.d.startpage.classList.add("hidden");
        this.d.questionContainer.classList.remove("hidden");
        this.d.endcontainer.classList.add("hidden");

        this.state.fragerichtig = 0;
        this.state.currentQuestionIndex = 0;
        this.state.fragefalsch = 0;

        const category = this.d.categoryDropdown.value;
        const hardness = this.d.hardness_select.value;
        const howmany = this.d.howmany.value;
        //console.log(this.get_api_url(category, hardness, howmany));
        try {
            if (category != "0") {
                const result = await fetch(
                    this.get_api_url(category, hardness, howmany),
                );
                const json = await result.json();
                if (json.response_code != 0) {
                    throw new Error("api response no good");
                }
                this.fragenObjekte = [];
                json.results.forEach((e) =>
                    this.fragenObjekte.push(Frage.from_api_obj(e))
                );
                console.log(json);
            }
        } catch (e) {
            console.error(e);
        }
        this.resetTimer(); // Timer starten
        this.d.correctCountElement.textContent =
            `Correct: ${this.state.fragerichtig}`;
        this.d.wrongCountElement.textContent =
            `Wrong: ${this.state.fragefalsch}`;
        this.renderQuestion(
            this.fragenObjekte[this.state.currentQuestionIndex],
        );
        this.d.questionNumber.textContent = `1/${this.fragenObjekte.length}`;
    }

    weiter() {
        const selected = document.querySelector(
            'input[name="frageOption"]:checked',
        );
        if (!selected) {
            return;
        }

        //this.d.weiterBtn.disabled = Boolean(!selected); // Deaktiviert den Button, wenn keine Option ausgewählt ist

        const userAnswer = selected.value;
        const currentFrage =
            this.fragenObjekte[this.state.currentQuestionIndex];

        if (currentFrage.pruefen(userAnswer)) {
            this.state.fragerichtig++;
        } else {
            this.state.fragefalsch++;
        }

        this.state.currentQuestionIndex++;

        if (this.state.currentQuestionIndex < this.fragenObjekte.length) { // Es gibt noch Fragen
            this.renderQuestion(
                this.fragenObjekte[this.state.currentQuestionIndex],
            );
        } else {
            this.show_endpage();
            this.d.endcontainer.innerHTML = `<h2>Quiz Finished!</h2>
                <p>${this.state.fragerichtig}/${this.fragenObjekte.length} Fragen richtig und ${this.state.fragefalsch}/${this.fragenObjekte.length} Fragen falsch.</p>
                <p>Gesamtzeit: ${this.d.timerDisplay.textContent}</p>`;
            this.stopTimer();
        }
    } // <-- This closes the weiterBtn.addEventListener function
    gotoEnd() {
        this.state.currentQuestionIndex = this.fragenObjekte.length - 1; // Setze den Index auf die letzte Frage
        this.renderQuestion();
    }
    // Quiz neu starten
    restart() {
        this.d.startpage.classList.remove("hidden");
        this.d.questionContainer.classList.add("hidden");
        this.d.endcontainer.classList.add("hidden");
    }
}

globalThis.addEventListener("DOMContentLoaded", () => {
    const app = new App();
    globalThis.app = app; // Globales App-Objekt
});
