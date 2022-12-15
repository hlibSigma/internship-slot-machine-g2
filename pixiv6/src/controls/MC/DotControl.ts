import { Graphics } from "@pixi/graphics";
import { Point } from "@pixi/math";
import MainControl from "../MainControl";

export default class DotControl extends MainControl {
    private readonly dotColor = 0x000000;
    private readonly graphics: Graphics;
    readonly dotRadius = 5;
    readonly position: { x: number; y: number };

    constructor(position: Point) {
        super();

        this.graphics = new Graphics()
            .beginFill(this.dotColor)
            .drawCircle(0, 0, this.dotRadius);

        this.graphics.pivot.set(0.5);
        this.graphics.position.set(position.x, position.y);
        
        this.position = this.graphics.position;

        this.container.addChild(this.graphics);
    }
}
