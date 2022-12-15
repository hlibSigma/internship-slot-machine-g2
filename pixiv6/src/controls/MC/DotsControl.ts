import { Graphics } from "@pixi/graphics";
import { Point } from "@pixi/math";
import { getCollision } from "app/helpers/math";
import { Sprite } from "pixi.js";
import MainControl from "../MainControl";

export default class DotControl extends MainControl {
  private readonly dotColor = 0x000000;
  private readonly graphics: Graphics;
  readonly dotRadius = 5;
  readonly position: Point;

  constructor(position: Point) {
    super();

    this.position = position;

    this.graphics = new Graphics()
      .beginFill(this.dotColor)
      .drawCircle(0, 0, this.dotRadius);

    this.graphics.pivot.set(0.5);
    this.graphics.position.set(position.x, position.y);

    this.container.addChild(this.graphics);
  }
}
