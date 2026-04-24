
// gestione del punteggio e del salvataggio
export class Storage {
    
    static getBestScore() {
        const saved = localStorage.getItem(this.BEST_SCORE_KEY);
        return saved ? parseInt(saved, 10) : 0;
    }
    
    static saveBestScore(score) {
        const currentBest = this.getBestScore();
        if (score > currentBest) {
            localStorage.setItem(this.BEST_SCORE_KEY, score.toString());
            return score;
        }
        return currentBest;
    }
    
    static resetBestScore() {
        localStorage.removeItem(this.BEST_SCORE_KEY);
    }
}
Storage.BEST_SCORE_KEY = 'endlessRunner_bestScore';
