// Background con effetto parallasse
 
export class Background {
    constructor(canvasWidth, canvasHeight) {
        
        this.farLayerX = 0;
        this.farLayerSpeed = 0.2;
        
        this.nearLayerX = 0;
        this.nearLayerSpeed = 0.5;
        
        this.clouds = [];
        this.mountains = [];
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.initElements();
    }

    // elementi decorativi
    
    initElements() {
        
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: Math.random() * this.canvasWidth,
                y: 30 + Math.random() * 60,
                width: 60 + Math.random() * 40,
                speed: 0.1 + Math.random() * 0.1
            });
        }
        
        for (let i = 0; i < 8; i++) {
            this.mountains.push({
                x: i * 120,
                height: 80 + Math.random() * 60,
                width: 100 + Math.random() * 40
            });
        }
    }
    
    // posizioni

    update(deltaTime, gameSpeed) {
        
        this.farLayerX -= gameSpeed * this.farLayerSpeed * deltaTime;
        if (this.farLayerX <= -this.canvasWidth) {
            this.farLayerX = 0;
        }
    
        this.nearLayerX -= gameSpeed * this.nearLayerSpeed * deltaTime;
        if (this.nearLayerX <= -this.canvasWidth) {
            this.nearLayerX = 0;
        }
        
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.speed * 50 * deltaTime;
            if (cloud.x + cloud.width < 0) {
                cloud.x = this.canvasWidth + cloud.width;
                cloud.y = 30 + Math.random() * 60;
            }
        });
        
        this.mountains.forEach(mountain => {
            mountain.x -= gameSpeed * 0.3 * deltaTime;
            if (mountain.x + mountain.width < 0) {
                mountain.x = this.canvasWidth + mountain.width;
            }
        });
    }
    
    // background

    draw(ctx) {
       
        const skyGradient = ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
        skyGradient.addColorStop(0, '#1a1a2e');
        skyGradient.addColorStop(0.5, '#16213e');
        skyGradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        this.drawStars(ctx);
    
        this.drawMountains(ctx);
        
        this.drawClouds(ctx);
        
        this.drawSpeedLines(ctx);
        
        this.drawGround(ctx);
    }
    
    // stelle

    drawStars(ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 50; i++) {
            const x = (i * 73) % this.canvasWidth;
            const y = (i * 37) % (this.canvasHeight * 0.6);
            const size = (i % 3) + 1;
            ctx.beginPath();
            ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // montagne
    
    drawMountains(ctx) {

        for (let pass = 0; pass < 2; pass++) {
            const offsetX = pass * this.canvasWidth + this.farLayerX * 0.5;
            this.mountains.forEach(mountain => {
                const x = mountain.x + offsetX;
                if (x > -mountain.width && x < this.canvasWidth + mountain.width) 
                    {
                    const gradient = ctx.createLinearGradient(x, this.canvasHeight - 100, x, this.canvasHeight);
                    gradient.addColorStop(0, '#2d4a6f');
                    gradient.addColorStop(1, '#1a2f4a');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.moveTo(x - mountain.width / 2, this.canvasHeight - 80);
                    ctx.lineTo(x, this.canvasHeight - mountain.height - 80);
                    ctx.lineTo(x + mountain.width / 2, this.canvasHeight - 80);
                    ctx.closePath();
                    ctx.fill();
                    // neve cima -----
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.beginPath();
                    ctx.moveTo(x - 15, this.canvasHeight - mountain.height - 50);
                    ctx.lineTo(x, this.canvasHeight - mountain.height - 80);
                    ctx.lineTo(x + 15, this.canvasHeight - mountain.height - 50);
                    ctx.closePath();
                    ctx.fill();
                }
            });
        }
    }
    
    // nuvole
    
    drawClouds(ctx) {
        
        for (let pass = 0; pass < 2; pass++) {
            const offsetX = pass * this.canvasWidth + this.farLayerX * 0.3;
            this.clouds.forEach(cloud => {
                const x = cloud.x + offsetX;
                if (x > -cloud.width && x < this.canvasWidth + cloud.width) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                    // nuvola stilizzata
                    ctx.beginPath();
                    ctx.arc(x, cloud.y, cloud.width * 0.3, 0, Math.PI * 2);
                    ctx.arc(x + cloud.width * 0.3, cloud.y - 10, cloud.width * 0.35, 0, Math.PI * 2);
                    ctx.arc(x + cloud.width * 0.6, cloud.y, cloud.width * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        }
    }
    
    // vento
    
    drawSpeedLines(ctx) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 2;
        const lineCount = 5;
        const spacing = this.canvasHeight / lineCount;
        for (let i = 0; i < lineCount; i++) {
            const y = i * spacing + spacing / 2;
            for (let pass = 0; pass < 2; pass++) {
                const startX = pass * this.canvasWidth + this.nearLayerX;
                ctx.beginPath();
                ctx.moveTo(startX, y);
                ctx.lineTo(startX + 100, y);
                ctx.stroke();
            }
        }
    }
    
    //terreno
    
    drawGround(ctx) {
        const groundHeight = 80;
        const groundY = this.canvasHeight - groundHeight;
        const groundGradient = ctx.createLinearGradient(0, groundY, 0, this.canvasHeight);
        groundGradient.addColorStop(0, '#1a1a2e');
        groundGradient.addColorStop(0.3, '#16213e');
        groundGradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, groundY, this.canvasWidth, groundHeight);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, groundY + 1);
        ctx.lineTo(this.canvasWidth, groundY + 1);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        const gridSpacing = 50;
        const offsetX = this.nearLayerX % gridSpacing;
        for (let x = offsetX; x < this.canvasWidth; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, groundY);
            ctx.lineTo(x - 30, this.canvasHeight);
            ctx.stroke();
        }
        for (let y = groundY + 20; y < this.canvasHeight; y += 15) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvasWidth, y);
            ctx.stroke();
        }
    }
    
    // Y base
    getGroundY() {
        return this.canvasHeight - 80;
    }
    
    // resetta il background
    reset() {
        this.farLayerX = 0;
        this.nearLayerX = 0;
    }
}
