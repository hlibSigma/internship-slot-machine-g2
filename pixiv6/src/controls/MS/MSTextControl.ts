import { Text } from "@pixi/text";
import { Ticker } from "@pixi/ticker";

import MainControl from "app/controls/MainControl";

export default class MSTextControl extends MainControl {
    private title: string;
    private value: number;
    private readonly text: Text;

    constructor(title: string, value: number) {
        super();
        this.title = title;
        this.value = value
        this.text = new Text(
            `${ this.title }: ${ this.value }`,
            {
                fontFamily: "PressStart2P",
                fill: 0xffffff,
                fontSize: 40,
            }
        );
        

        this.text.anchor.set(0.5);
        this.container.addChild(this.text);
    }

    increment(delta:number) {
        this.value += delta;
        this.update(this.value);
    }

    update(value:number) {
        this.value = value;
        this.text.text = `${this.title}: ${this.value}`;
        this.animate();
    }

    private animate() {
        const ticker = new Ticker();
        let time = 0;

        ticker.add((delta) => {
            const sin = Math.sin(time);

            this.text.scale.set(1 + (sin * 0.2));

            if (sin <= -0.98) {
                ticker.destroy();
            } else {
                time += 0.2 * delta;
            }
        });

        ticker.start();
    }
}