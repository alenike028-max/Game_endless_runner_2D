// input tastiera

export class InputHandler {
    constructor() {
        this.keys = new Set();
        this.setupListeners();
    }
    setupListeners() {
        window.addEventListener('keydown', (e) => {
            
            if (['Space', 'ArrowDown', 'ArrowUp'].includes(e.code)) {
                e.preventDefault();
            }
            this.keys.add(e.code);
        });
        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.code);
        });
    }
    
    // controllo tasto premuto
    
    isPressed(code) {
        return this.keys.has(code);
    }

    isJumpPressed() {
        return this.keys.has('Space');
    }
    
    isSlidePressed() {
        return this.keys.has('ArrowDown');
    }
}
