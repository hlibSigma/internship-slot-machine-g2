import { Text } from "@pixi/text";
import TweenMax from "gsap";

import MainControl from "app/controls/MainControl";

export default class ScoreControl extends MainControl {
    private readonly title = 'Score';
    private counter = 0;
    private readonly text: Text;

    constructor() {
        super();

        this.text = new Text(
            `${ this.title }: ${ this.counter }`,
            {
                fontFamily: "PressStart2P",
                fill: 0xffffff
            }
        );

        this.text.anchor.set(0.5);
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

    private animate(intensity = 0.3, duration = 0.2) {
        TweenMax.to(this.container.scale, duration, {
            x: `+=${intensity}`,
            y: `+=${intensity}`,
            yoyo: true,
            repeat: 1,
        });
    }
}