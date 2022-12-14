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
      fill: 0xffffff,
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
    let expands = true;
    const interval = setInterval(() => {
      const size = this.text.scale.x;
      if (expands) {
        this.text.scale.set(size + 0.09);
        if (size >= 3) {
          expands = false;
        }
      } else {
        this.text.scale.set(size - 0.09);
        if (size <= 2) {
          clearInterval(interval);
          return;
        }
      }
    }, 1000 / 60);
  }
}
