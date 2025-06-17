export class Frage {
    constructor(frage, optionen, antwort) {
        this.frage = frage;
        this.optionen = optionen;
        this.antwort = antwort;
    }

    static from_api_obj(obj) {
        this.sample = {
            "type": "multiple",
            "difficulty": "easy",
            "category": "Politics",
            "question":
                "How many people are in the U.S. House of Representatives?",
            "correct_answer": "435",
            "incorrect_answers": [
                "260",
                "415",
                "50",
            ],
        };
        return new Frage(
            obj.question,
            [obj.correct_answer, ...obj.incorrect_answers].toSorted(() =>
                Math.random() - 0.5
            ),
            obj.correct_answer,
        );
    }
    // Methode zum Prüfen der Antwort
    pruefen(antwort) {
        return this.antwort === antwort;
    }
}
