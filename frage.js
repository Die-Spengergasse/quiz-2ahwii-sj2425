export class Frage {
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
