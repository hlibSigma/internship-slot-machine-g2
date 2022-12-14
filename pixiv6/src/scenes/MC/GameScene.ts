import BackgroundControl from "app/controls/BackgroundControl";
import TextButtonControl from "app/controls/button/TextButtonControl";
import BaseScene from "../BaseScene";
import Resources from "app/pixi/StrictResourcesHelper";
import ChoiceScene from "../ChoiceScene";
import PacmanControl from "app/controls/MC/PacmanControl";
import DotsControl from "app/controls/MC/DotsControl";
import { Point } from "pixi.js";
import { getCollision } from "app/helpers/math";
import ScoreControl from "app/controls/MC/ScoreControl";

export default class GameScene extends BaseScene {
  private readonly pacman = new PacmanControl();
  private readonly dots: DotsControl[] = [];
  private readonly score: ScoreControl = new ScoreControl();

  compose(): void {
    const textButtonControll = new TextButtonControl("Back");
    this.addControl(textButtonControll);
    textButtonControll.container.position.set(100, 100);
    textButtonControll.onClick.add(this.onBackClick, this);
    this.addControl(this.pacman);
    this.addControl(this.score);
    this.addDots();
  }

  private addDots() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 100; i < width - 100; i += 100) {
      for (let j = 100; j < height - 100; j += 100) {
        const dot = new DotsControl(new Point(i, j));
        this.addControl(dot);
        this.dots.push(dot);
      }
    }
  }

  private checkCollision() {
    this.dots.forEach((dot) => {
      if (
        getCollision(
          dot.position,
          dot.dotRadius,
          this.pacman.sprite.position,
          this.pacman.sprite.width
        )
      ) {
        this.score.increment();
        this.dots.splice(this.dots.indexOf(dot), 1);
        this.scene.removeChild(dot.container);
      }
    });
  }

  private onBackClick() {
    this.sceneManager.navigate(ChoiceScene);
  }

  private checkBorders() {
    const { x, y } = this.pacman.sprite.position;
    console.log(x % window.innerWidth);
    if (x > window.innerWidth || x < 0 || y > window.innerHeight || y < 0) {
      this.sceneManager.navigate(ChoiceScene);
    }
  }

  protected onUpdate(delta: number): void {
    super.onUpdate(delta);
    this.pacman.positionUpdate(delta);
    this.checkCollision();
    this.checkBorders();
  }
}
