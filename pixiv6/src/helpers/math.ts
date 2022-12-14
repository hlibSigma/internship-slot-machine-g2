import { Sprite } from "@pixi/sprite";
import { Point } from "pixi.js";

export class Vector {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector) {
    this.y = this.y + v.y;
    this.x = this.x + v.x;
    return this;
  }

  sub(v: Vector) {
    this.x = this.x - v.x;
    this.y = this.y - v.y;
    return this;
  }

  mult(n: number) {
    this.x = this.x * n;
    this.y = this.y * n;
    return this;
  }

  div(n: number) {
    this.x = this.x / n;
    this.y = this.y / n;
    return this;
  }

  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  normalize() {
    const m = this.mag();
    if (m == 0) {
      this.x = 1;
      this.y = 0;
    } else {
      this.div(m);
    }
    return this;
  }
}

export function distance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

export function lerp(value1: number, value2: number, amount: number) {
  return (1 - amount) * value1 + amount * value2;
}

export const getCollision = (
  pos1: Point,
  width1: number,
  pos2: Point,
  width2: number
) => {
  const dist = distance(pos1, pos2);
  if (dist < width1 * 0.5 + width2 * 0.5) return true;
  return false;
};
