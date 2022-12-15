import { Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { distance, getCollision, Vector } from "app/helpers/math";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";
import { Point } from "pixi.js";
import MainControl from "../MainControl";

export default class GhostControl extends MainControl {
  private readonly ghost: Sprite;
  private readonly speed: number = 2;

  constructor() {
    super();
    const texture: Texture = StrictResourcesHelper.getTexture(
      "MC_GHOST",
      "ghost.png"
    );

    this.ghost = new Sprite(texture);

    this.ghost.anchor.set(0.5);
    this.ghost.scale.set(0.2);

    this.container.addChild(this.ghost);
  }

  followPacman(delta: number, pacman: Point) {
    const moveVector = new Vector(
      pacman.x - this.ghost.position.x,
      pacman.y - this.ghost.position.y
    );
    moveVector.normalize();

    if (moveVector.x < 0) {
      this.ghost.scale.x = -0.2;
    } else {
      this.ghost.scale.x = 0.2;
    }

    this.ghost.position.x += moveVector.x * this.speed * delta;
    this.ghost.position.y += moveVector.y * this.speed * delta;
  }

  checkGhostCollision(pacman: Sprite): boolean {
    if (
      getCollision(
        this.ghost.position,
        this.ghost.width,
        pacman.position,
        pacman.width
      )
    ) {
      return true;
    }
    return false;
  }

  update(delta: number, pacman: Sprite) {
    this.followPacman(delta, pacman.position);
  }
}
