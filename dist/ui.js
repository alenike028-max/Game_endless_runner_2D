import { Storage } from './storage.js';
export var GameState;
(function (GameState) {
    GameState["MENU"] = "MENU";
    GameState["PLAYING"] = "PLAYING";
    GameState["PAUSED"] = "PAUSED";
    GameState["GAMEOVER"] = "GAMEOVER";
})(GameState || (GameState = {}));

// Gestione UI - Menu, HUD, Game Over
export class UIManager {
    constructor() {
        this.gameState = GameState.MENU;
        this.onStart = null;
        this.onResume = null;
        this.onRestart = null;
        this.menuScreen = document.getElementById('menu-screen');
        this.hudScreen = document.getElementById('hud');
        this.pauseScreen = document.getElementById('pause-screen');
        this.gameoverScreen = document.getElementById('gameover-screen');
        this.menuBestScore = document.getElementById('menu-best-score');
        this.currentScoreEl = document.getElementById('current-score');
        this.hudBestScoreEl = document.getElementById('hud-best-score');
        this.finalScoreEl = document.getElementById('final-score');
        this.gameoverBestScoreEl = document.getElementById('gameover-best-score');
        this.setupButtons();
        this.updateBestScoreDisplay();
    }
    // setup dei bottoni
    setupButtons() {
        const startBtn = document.getElementById('start-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const resumeBtn = document.getElementById('resume-btn');
        const restartBtn = document.getElementById('restart-btn');
        startBtn?.addEventListener('click', () => {
            if (this.onStart)
                this.onStart();
        });
        pauseBtn?.addEventListener('click', () => {
            if (this.gameState === GameState.PLAYING) {
                this.pauseGame();
            }
            else if (this.gameState === GameState.PAUSED) {
                this.resumeGame();
            }
        });
        resumeBtn?.addEventListener('click', () => {
            this.resumeGame();
        });
        restartBtn?.addEventListener('click', () => {
            if (this.onRestart)
                this.onRestart();
        });
    }
    
    // aggiorna il best score in tutte le schermate
    updateBestScoreDisplay() {
        const bestScore = Storage.getBestScore();
        this.menuBestScore.textContent = bestScore.toString();
        this.hudBestScoreEl.textContent = bestScore.toString();
        this.gameoverBestScoreEl.textContent = bestScore.toString();
    }
    
    updateScore(score) {
        this.currentScoreEl.textContent = Math.floor(score).toString();
    }
    
    // menu iniziale
    showMenu() {
        this.gameState = GameState.MENU;
        this.updateBestScoreDisplay();
        this.menuScreen.classList.remove('hidden');
        this.hudScreen.classList.add('hidden');
        this.pauseScreen.classList.add('hidden');
        this.gameoverScreen.classList.add('hidden');
    }
    
    // avvia il gioco
    startGame() {
        this.gameState = GameState.PLAYING;
        this.menuScreen.classList.add('hidden');
        this.hudScreen.classList.remove('hidden');
        this.pauseScreen.classList.add('hidden');
        this.gameoverScreen.classList.add('hidden');
        this.updateScore(0);
    }

    // pausa
    pauseGame() {
        this.gameState = GameState.PAUSED;
        this.pauseScreen.classList.remove('hidden');
    }
    
    // riprendi
    resumeGame() {
        this.gameState = GameState.PLAYING;
        this.pauseScreen.classList.add('hidden');
        if (this.onResume)
            this.onResume();
    }
    
    // game over
    showGameOver(score) {
        this.gameState = GameState.GAMEOVER;
        const newBest = Storage.saveBestScore(Math.floor(score));
        this.finalScoreEl.textContent = Math.floor(score).toString();
        this.gameoverBestScoreEl.textContent = Math.floor(newBest).toString();
        this.hudScreen.classList.add('hidden');
        this.pauseScreen.classList.add('hidden');
        this.gameoverScreen.classList.remove('hidden');
    }
    
    getState() {
        return this.gameState;
    }
   
    isPaused() {
        return this.gameState === GameState.PAUSED;
    }
    
    isPlaying() {
        return this.gameState === GameState.PLAYING;
    }
}
