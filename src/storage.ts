export class Storage {
    private static readonly BEST_SCORE_KEY = 'endlessRunner_bestScore';

    static getBestScore(): number {
        const saved = localStorage.getItem(this.BEST_SCORE_KEY);
        return saved ? parseInt(saved, 10) : 0;
    }

    static saveBestScore(score: number): number {
        const currentBest = this.getBestScore();
        if (score > currentBest) {
            localStorage.setItem(this.BEST_SCORE_KEY, score.toString());
            return score;
        }
        return currentBest;
    }

    static resetBestScore(): void {
        localStorage.removeItem(this.BEST_SCORE_KEY);
    }
}
