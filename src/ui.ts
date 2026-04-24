import { Storage } from './storage.js';

export enum GameState {
    MENU = 'MENU',
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    GAMEOVER = 'GAMEOVER'
}

export class UIManager {
    private gameState: GameState = GameState.MENU;

    private menuScreen: HTMLElement;
    private hudScreen: HTMLElement;
    private pauseScreen: HTMLElement;
    private gameoverScreen: HTMLElement;

    private menuBestScore: HTMLElement;
    private currentScoreEl: HTMLElement;
    private hudBestScoreEl: HTMLElement;
    private finalScoreEl: HTMLElement;
    private gameoverBestScoreEl: HTMLElement;

    public onStart: (() => void) | null = null;
    public onResume: (() => void) | null = null;
    public onRestart: (() => void) | null = null;

    constructor() {
        this.menuScreen = document.getElementById('menu-screen')!;
        this.hudScreen = document.getElementById('hud')!;
        this.pauseScreen = document.getElementById('pause-screen')!;
        this.gameoverScreen = document.getElementById('gameover-screen')!;

        this.menuBestScore = document.getElementById('menu-best-score')!;
        this.currentScoreEl = document.getElementById('current-score')!;
        this.hudBestScoreEl = document.getElementById('hud-best-score')!;
        this.finalScoreEl = document.getElementById('final-score')!;
        this.gameoverBestScoreEl = document.getElementById('gameover-best-score')!;

        this.setupButtons();

        this.updateBestScoreDisplay();
    }

    private setupButtons(): void {
        const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
        const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;
        const resumeBtn = document.getElementById('resume-btn') as HTMLButtonElement;
        const restartBtn = document.getElementById('restart-btn') as HTMLButtonElement;

        startBtn?.addEventListener('click', () => {
            if (this.onStart) this.onStart();
        });

        pauseBtn?.addEventListener('click', () => {
            if (this.gameState === GameState.PLAYING) {
                this.pauseGame();
            } else if (this.gameState === GameState.PAUSED) {
                this.resumeGame();
            }
        });

        resumeBtn?.addEventListener('click', () => {
            this.resumeGame();
        });

        restartBtn?.addEventListener('click', () => {
            if (this.onRestart) this.onRestart();
        });
    }

    private updateBestScoreDisplay(): void {
        const bestScore = Storage.getBestScore();
        this.menuBestScore.textContent = bestScore.toString();
        this.hudBestScoreEl.textContent = bestScore.toString();
        this.gameoverBestScoreEl.textContent = bestScore.toString();
    }

    updateScore(score: number): void {
        this.currentScoreEl.textContent = Math.floor(score).toString();
    }

    showMenu(): void {
        this.gameState = GameState.MENU;
        this.updateBestScoreDisplay();

        this.menuScreen.classList.remove('hidden');
        this.hudScreen.classList.add('hidden');
        this.pauseScreen.classList.add('hidden');
        this.gameoverScreen.classList.add('hidden');
    }

    startGame(): void {
        this.gameState = GameState.PLAYING;

        this.menuScreen.classList.add('hidden');
        this.hudScreen.classList.remove('hidden');
        this.pauseScreen.classList.add('hidden');
        this.gameoverScreen.classList.add('hidden');

        this.updateScore(0);
    }

    pauseGame(): void {
        this.gameState = GameState.PAUSED;
        this.pauseScreen.classList.remove('hidden');
    }

    resumeGame(): void {
        this.gameState = GameState.PLAYING;
        this.pauseScreen.classList.add('hidden');
        if (this.onResume) this.onResume();
    }

    showGameOver(score: number): void {
        this.gameState = GameState.GAMEOVER;

        const newBest = Storage.saveBestScore(Math.floor(score));

        this.finalScoreEl.textContent = Math.floor(score).toString();
        this.gameoverBestScoreEl.textContent = Math.floor(newBest).toString();

        this.hudScreen.classList.add('hidden');
        this.pauseScreen.classList.add('hidden');
        this.gameoverScreen.classList.remove('hidden');
    }

    getState(): GameState {
        return this.gameState;
    }

    isPaused(): boolean {
        return this.gameState === GameState.PAUSED;
    }

    isPlaying(): boolean {
        return this.gameState === GameState.PLAYING;
    }
}
