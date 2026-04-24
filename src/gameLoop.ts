import { Player } from './player.js';
import { Obstacle } from './obstacle.js';
import { checkCollision } from './collision.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { UIManager } from './ui.js';


export const GameConfig = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 400,
    PLAYER_X: 100,
    BASE_SPEED: 300,
    MAX_SPEED: 800,
    SPEED_INCREMENT: 10,
    SPEED_INCREMENT_TIME: 5,
    GROUND_Y: 320
};


export class GameLoop {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private player: Player;
    private background: Background;
    private input: InputHandler;
    private ui: UIManager;

    private obstacles: Obstacle[] = [];

    private gameSpeed: number = GameConfig.BASE_SPEED;
    private score: number = 0;
    private distance: number = 0;
    private timeElapsed: number = 0;

    private lastTime: number = 0;
    private isRunning: boolean = false;
    private animationId: number | null = null;

    constructor(canvas: HTMLCanvasElement, ui: UIManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;

        
        this.canvas.width = GameConfig.CANVAS_WIDTH;
        this.canvas.height = GameConfig.CANVAS_HEIGHT;

        
        this.background = new Background(this.canvas.width, this.canvas.height);
        this.player = new Player(GameConfig.PLAYER_X, GameConfig.GROUND_Y);
        this.input = new InputHandler();
        this.ui = ui;
    }

    
    start(): void {
        this.reset();
        this.isRunning = true;
        this.lastTime = performance.now();
        console.log('Game started!');
        this.gameLoop(this.lastTime);
    }

    
    reset(): void {
        this.gameSpeed = GameConfig.BASE_SPEED;
        this.score = 0;
        this.distance = 0;
        this.timeElapsed = 0;
        this.obstacles = [];
        this.player.reset(GameConfig.GROUND_Y);
        this.background.reset();
    }

    
    private gameLoop = (currentTime: number): void => {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        const safeDelta = Math.min(deltaTime, 0.1);

        if (this.ui.isPlaying()) {
            this.update(safeDelta);
        }
        
        this.draw();

        this.animationId = requestAnimationFrame(this.gameLoop);
    };

    private update(deltaTime: number): void {
        this.timeElapsed += deltaTime;
        this.distance += this.gameSpeed * deltaTime;

        this.score = this.distance + (this.timeElapsed * 10);

        const speedIncreases = Math.floor(this.timeElapsed / GameConfig.SPEED_INCREMENT_TIME);
        this.gameSpeed = Math.min(
            GameConfig.BASE_SPEED + (speedIncreases * GameConfig.SPEED_INCREMENT),
            GameConfig.MAX_SPEED
        );

        this.background.update(deltaTime, this.gameSpeed);

        this.player.update(deltaTime, this.input);

        this.updateObstacles(deltaTime);

        this.checkCollisions();

        this.ui.updateScore(this.score);
    }

    private updateObstacles(deltaTime: number): void {
        this.obstacles = this.obstacles.filter(
            obs => !obs.isOffScreen(this.canvas.width)
        );

        this.obstacles.forEach(obs => obs.update(deltaTime, this.gameSpeed));

        const lastObstacle = this.obstacles[this.obstacles.length - 1];
        const lastX = lastObstacle ? lastObstacle.x : 0;

        if (this.obstacles.length === 0 || lastX < this.canvas.width - 300) {
            if (Math.random() < 0.02) {
                const newObstacle = new Obstacle(this.canvas.width, GameConfig.GROUND_Y);
                this.obstacles.push(newObstacle);
            }
        }
    }

    private checkCollisions(): void {
        const playerBox = this.player.getCollisionBox();

        for (const obstacle of this.obstacles) {
            if (checkCollision(playerBox, obstacle.getCollisionBox())) {
                this.gameOver();
                return;
            }
        }
    }

    private gameOver(): void {
        this.isRunning = false;
        this.ui.showGameOver(this.score);
    }

    private draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.background.draw(this.ctx);

        this.obstacles.forEach(obs => obs.draw(this.ctx));

        this.player.draw(this.ctx);

        this.drawEffects();
    }

    private drawEffects(): void {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2,
            this.canvas.height / 2,
            this.canvas.height / 3,
            this.canvas.width / 2,
            this.canvas.height / 2,
            this.canvas.height
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    stop(): void {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume(): void {
        this.lastTime = performance.now();
    }

    getScore(): number {
        return this.score;
    }

    getSpeed(): number {
        return this.gameSpeed;
    }
}
