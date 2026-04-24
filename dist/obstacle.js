// gestisce gli ostacoli

export class Obstacle {
    constructor(x, groundY, type) {
        this.width = 0;
        this.height = 0;
        this.passed = false;
        this.type = type ?? (Math.random() < 0.5 ? 'low' : 'high');
        this.initDimensions();
        this.x = x;
        this.y = this.type === 'low'
            ? groundY - this.height
            : groundY - this.height - 20;
    }
    initDimensions() {
        if (this.type === 'low') {
            this.width = Obstacle.LOW_WIDTH;
            this.height = Obstacle.LOW_HEIGHT;
        }
        else {
            this.width = Obstacle.HIGH_WIDTH;
            this.height = Obstacle.HIGH_HEIGHT;
        }
    }

    // posizione dell'ostacolo
    
    update(deltaTime, speed) {
        this.x -= speed * deltaTime;
    }

    isOffScreen(_canvasWidth) {
        return this.x + this.width < 0;
    }
    
    // ostacolo
    
    draw(ctx) {
        ctx.save();
        if (this.type === 'low') {
            this.drawLowObstacle(ctx);
        }
        else {
            this.drawHighObstacle(ctx);
        }
        ctx.restore();
    }
    
    // ostacolo basso
    
    drawLowObstacle(ctx) {
       
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height + 3, this.width / 2, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#4ECDC4');
        gradient.addColorStop(1, '#2CB5A8');
        ctx.fillStyle = gradient;
        this.roundRect(ctx, this.x, this.y, this.width, this.height, 6);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(this.x + 8, this.y + 8, this.width - 16, 6);
        ctx.fillRect(this.x + 8, this.y + 20, this.width - 16, 6);
        
        ctx.fillStyle = '#2CB5A8';
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y);
        ctx.lineTo(this.x + this.width / 2, this.y - 8);
        ctx.lineTo(this.x + this.width - 10, this.y);
        ctx.fill();
    }
    
    // ostacolo alto 
    
    drawHighObstacle(ctx) {
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height + 3, this.width / 2, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#9B59B6');
        gradient.addColorStop(1, '#8E44AD');
        ctx.fillStyle = gradient;
        this.roundRect(ctx, this.x, this.y, this.width, this.height, 6);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        ctx.clip();
        for (let i = -this.height; i < this.width; i += 15) {
            ctx.beginPath();
            ctx.moveTo(this.x + i, this.y);
            ctx.lineTo(this.x + i + 10, this.y);
            ctx.lineTo(this.x + i - 5, this.y + this.height);
            ctx.lineTo(this.x + i - 15, this.y + this.height);
            ctx.fill();
        }
        ctx.restore();
        
        ctx.fillStyle = '#7D3C98';
        ctx.fillRect(this.x, this.y + this.height - 15, this.width, 15);
    }
    
    // rettangolo
    
    roundRect(ctx, x, y, width, height, radius) {
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
    
    // rettangolo di collisione
    
    getCollisionBox() {
        const padding = 4;
        return {
            x: this.x + padding,
            y: this.y + padding,
            width: this.width - padding * 2,
            height: this.height - padding * 2
        };
    }
}
// Dimensioni
Obstacle.LOW_WIDTH = 50;
Obstacle.LOW_HEIGHT = 40;
Obstacle.HIGH_WIDTH = 40;
Obstacle.HIGH_HEIGHT = 70;

// generatore di ostacoli

export class ObstacleGenerator {
    reset() {
        
    }
}
