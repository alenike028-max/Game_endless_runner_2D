export class InputHandler {
    private keys: Set<string> = new Set();

    constructor() {
        this.setupListeners();
    }

    private setupListeners(): void {
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

    isPressed(code: string): boolean {
        return this.keys.has(code);
    }

    isJumpPressed(): boolean {
        return this.keys.has('Space');
    }

    isSlidePressed(): boolean {
        return this.keys.has('ArrowDown');
    }
}
