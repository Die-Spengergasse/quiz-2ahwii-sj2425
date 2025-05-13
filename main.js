// URL für die API
const apiUrl = 'https://opentdb.com/api.php?amount=10&category=11&type=multiple';

// Fetch-Aufruf an die API
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data.response_code === 0) {
            // Erfolgreicher API-Aufruf, die Fragen in der Konsole anzeigen
            console.log(data.results); 
            renderQuiz(data.results); // Hier wird die renderQuiz-Funktion aufgerufen
        } else {
            console.error("Fehler bei der API-Antwort: ", data);
        }
    })
    .catch(error => {
        console.error("Fehler beim Abrufen der API-Daten:", error);
    });

// Funktion zum Rendern der Fragen (diese kannst du nach Belieben anpassen)
function renderQuiz(questions) {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = ""; // Bestehende Fragen löschen (falls vorhanden)

    questions.forEach((question, index) => {
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("quiz-item");
        
        const questionText = document.createElement("h2");
        questionText.textContent = question.question;
        questionDiv.appendChild(questionText);

        // Antworten mischen
        const answers = [...question.incorrect_answers, question.correct_answer];
        shuffleArray(answers);

        // Antwort-Buttons hinzufügen
        answers.forEach(answer => {
            const answerButton = document.createElement("button");
            answerButton.textContent = answer;
            answerButton.classList.add("answer-btn");
            answerButton.onclick = () => checkAnswer(answer, question.correct_answer);
            questionDiv.appendChild(answerButton);
        });

        quizContainer.appendChild(questionDiv);
    });
}

// Funktion zum Mischen der Antworten (Fisher-Yates Algorithmus)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Funktion zum Überprüfen der Antwort
function checkAnswer(selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        alert('Richtig!');
    } else {
        alert('Falsch!');
    }
}




