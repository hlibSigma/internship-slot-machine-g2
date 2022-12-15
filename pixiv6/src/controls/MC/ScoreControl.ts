import MainControl from "../MainControl";

import { Text } from "@pixi/text";
import { Ticker } from "@pixi/ticker";

export default class ScoreControl extends MainControl {
    private readonly title = "Score";
    private counter = 0;
    private readonly text: Text;

    constructor() {
        super();

        this.text = new Text(`${this.title}: ${this.counter}`, {
            fontFamily: "PressStart2P",
            fill: 0x000000,
        });

        this.text.anchor.set(0.5);
        this.text.position.set(window.innerWidth / 2, 50);
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
}
