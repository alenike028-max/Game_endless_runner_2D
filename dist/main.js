import { GameLoop } from './gameLoop.js';
import { UIManager, GameState } from './ui.js';
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

// Inizializza il gioco

function initGame() {
    const canvas = document.getElementById('game-canvas');
    const ui = new UIManager();
    const game = new GameLoop(canvas, ui);
    
    ui.onStart = () => {
        ui.startGame();
        game.start();
    };
    ui.onResume = () => {
        ui.resumeGame();
        game.resume();
    };
    ui.onRestart = () => {
        ui.startGame();
        game.start();
    };

    // P pausa
    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyP') {
            e.preventDefault();
            const state = ui.getState();
            if (state === GameState.PLAYING) {
                ui.pauseGame();
            }
            else if (state === GameState.PAUSED) {
                ui.resumeGame();
            }
        }
    });
    // menu iniziale
    ui.showMenu();
    console.log('Endless Runner inizializzato!');
    console.log('Controlli: SPAZIO = Salta, FRECCIA GIÙ = Scivola, P = Pausa');
}
