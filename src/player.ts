import { Rectangle } from './collision.js';

export class Player implements Rectangle {
    x: number;
    y: number;
    width: number = 50;
    height: number = 60;
    heightNormal: number = 60;
    heightSliding: number = 30;

    velocityY: number = 0;
    gravity: number = 1500;
    jumpVelocity: number = -500;

    isJumping: boolean = false;
    isSliding: boolean = false;
    isOnGround: boolean = true;

    private groundY: number;

    private slideTimer: number = 0;
    private readonly slideDuration: number = 0.5;

    constructor(x: number, groundY: number) {
        this.x = x;
        this.groundY = groundY;
        this.y = groundY - this.height;
    }

    update(deltaTime: number, input: import('./input').InputHandler): void {
        if (input.isJumpPressed() && this.isOnGround && !this.isSliding) {
            this.jump();
        }

        if (input.isSlidePressed() && !this.isSliding && this.isOnGround) {
            this.startSlide();
        } else if (!input.isSlidePressed() && this.isSliding) {
            this.endSlide();
        }

        if (this.isSliding) {
            this.slideTimer -= deltaTime;
            if (this.slideTimer <= 0) {
                this.endSlide();
            }
        }

        this.applyGravity(deltaTime);

        if (this.y + this.height >= this.groundY) {
            this.y = this.groundY - this.height;
            this.velocityY = 0;
            this.isJumping = false;
            this.isOnGround = true;
        } else {
            this.isOnGround = false;
        }
    }

    private jump(): void {
        this.velocityY = this.jumpVelocity;
        this.isJumping = true;
        this.isOnGround = false;
    }

    private startSlide(): void {
        this.isSliding = true;
        this.height = this.heightSliding;
        this.slideTimer = this.slideDuration;

        if (this.isOnGround) {
            this.y = this.groundY - this.height;
        }
    }

    private endSlide(): void {
        this.isSliding = false;
        this.height = this.heightNormal;

        if (this.isOnGround) {
            this.y = this.groundY - this.height;
        }
    }

    private applyGravity(deltaTime: number): void {
        if (!this.isOnGround) {
            this.velocityY += this.gravity * deltaTime;
            this.y += this.velocityY * deltaTime;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        const gradient = ctx.createLinearGradient(
            this.x, this.y,
            this.x + this.width, this.y + this.height
        );
        gradient.addColorStop(0, '#FF6B6B');
        gradient.addColorStop(1, '#EE5A5A');

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width / 2,
            this.y + this.height + 5,
            this.width / 2,
            8,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        ctx.fillStyle = gradient;
        this.roundRect(ctx, this.x, this.y, this.width, this.height, 8);
        ctx.fill();

        if (this.isSliding) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, 8);
        }

        ctx.fillStyle = '#fff';
        const eyeY = this.isSliding ? this.y + 8 : this.y + 15;
        const eyeOffset = this.isSliding ? 8 : 12;

        ctx.beginPath();
        ctx.ellipse(this.x + eyeOffset, eyeY, 6, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(this.x + this.width - eyeOffset, eyeY, 6, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1a1a2e';
        const pupilY = this.isSliding ? eyeY + 1 : eyeY + 2;
        ctx.beginPath();
        ctx.arc(this.x + eyeOffset + 2, pupilY, 3, 0, Math.PI * 2);
        ctx.arc(this.x + this.width - eyeOffset - 2, pupilY, 3, 0, Math.PI * 2);
        ctx.fill();

        if (!this.isSliding && this.isJumping) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            for (let i = 1; i <= 3; i++) {
                ctx.beginPath();
                ctx.arc(
                    this.x - i * 8,
                    this.y + this.height / 2 + (i % 2 === 0 ? -5 : 5),
                    4 - i,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }

        ctx.restore();
    }

    private roundRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
    ): void {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    getCollisionBox(): Rectangle {
        const padding = 8;
        return {
            x: this.x + padding,
            y: this.y + padding,
            width: this.width - padding * 2,
            height: this.height - padding * 2
        };
    }

    reset(groundY: number): void {
        this.y = groundY - this.heightNormal;
        this.velocityY = 0;
        this.isJumping = false;
        this.isSliding = false;
        this.isOnGround = true;
        this.height = this.heightNormal;
    }
}
