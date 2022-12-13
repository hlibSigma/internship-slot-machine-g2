import { Graphics } from "@pixi/graphics";
import { Point } from "@pixi/math";
import { Sprite } from "@pixi/sprite";

import MainControl from "app/controls/MainControl";
import { distance } from "app/helpers/math";

export default class DotControl extends MainControl {
    private readonly size = 10;
    private readonly color = 0xe9b8af;
    private readonly graphics: Graphics;

    constructor(position: Point) {
        super();

        this.graphics = new Graphics()
            .beginFill(this.color)
            .drawRect(0, 0, this.size, this.size);

        this.graphics.pivot.set(0.5);
        this.graphics.position.set(position.x, position.y);

        this.container.addChild(this.graphics);
    }

    animate(delta: number) {
        const time = Date.now();
        const sin = Math.sin(time * 0.01);

        this.graphics.scale.set(1 + (sin * 0.2 * delta));
    }

    checkCollision(sprite: Sprite) {
        const dist = distance(sprite.position, this.graphics.position);
        return dist < sprite.width / 2 + this.size;
    }
}
