import MainControl from "../MainControl";

import { Text } from "@pixi/text";
import { Ticker } from "@pixi/ticker";

export default class ScoreControl extends MainControl {
    private readonly title = "Score";
    private counter = 0;
    private readonly text: Text;
    readonly position: { x: number; y: number };

    constructor() {
        super();

        this.text = new Text(`${this.title}: ${this.counter}`, {
            fontFamily: "PressStart2P",
            fill: 0x000000,
        });

        this.text.anchor.set(0.5);
        this.position = { x: window.innerWidth / 2, y: 50 };
        this.text.position.set(this.position.x, this.position.y);
        this.text.scale.set(2);
        this.container.addChild(this.text);
    }

    increment() {
        this.counter++;
        this.update();
        this.animate();
    }

    private update() {
        this.text.text = `${this.title}: ${this.counter}`;
    }

    private animate() {
        const ticker = new Ticker();
        let time = 0;

        ticker.add((delta) => {
            const sin = Math.sin(time);

            this.text.scale.set(2 + sin * 0.2);

            if (sin <= -0.98) {
                ticker.destroy();
            } else {
                time += 0.2 * delta;
            }
        });

        ticker.start();
    }

    checkScoresCounter(amount: number): boolean {
        if (this.counter >= amount) {
            return true;
        }
        return false;
    }
}
