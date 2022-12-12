import { AnimatedSprite } from "@pixi/sprite-animated";

import MainControl from "../MainControl";
import Resources from "app/pixi/StrictResourcesHelper";
import { Vector } from "app/helpers/math";

enum Key {
    Up = "ArrowUp",
    Left = "ArrowLeft",
    Down = "ArrowDown",
    Right = "ArrowRight",
    W = "w",
    A = "a",
    S = "s",
    D = "d",
}

export default class OS_PacmanControl extends MainControl {
    readonly sprite: AnimatedSprite;
    readonly moveSpeed = 4;
    private readonly vector = new Vector(0, 0);

    constructor() {
        super();

        const textures = Resources.getAnimation(
            "OS_PACMAN",
            "IDLE"
        );

        this.sprite = new AnimatedSprite(textures);
        this.sprite.animationSpeed = 3000;

        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.65);

        this.sprite.position.set(
            window.innerWidth / 2,
            window.innerHeight / 2
        );

        this.sprite.play();
        this.control();

        this.container.addChild(this.sprite);
    }

    update(delta: number) {
        this.move(delta);
        this.rotate(delta);
    }

    grow() {
        const { scale } = this.sprite;
        const growthRate = 0.0025;

        scale.x += growthRate;
        scale.y += growthRate * (scale.y > 0 ? 1 : -1);
    }

    private control() {
        const offset = 0.4;

        window.document.addEventListener("keydown", ({ key }) => {
            switch (key) {
                case Key.W:
                case Key.Up:
                    this.vector.y -= offset;
                    break;

                case Key.A:
                case Key.Left:
                    this.vector.x -= offset;
                    break;

                case Key.S:
                case Key.Down:
                    this.vector.y += offset;
                    break;

                case Key.D:
                case Key.Right:
                    this.vector.x += offset;
                    break;

                default:
                    return;
            }

            this.vector.normalize();
        });
    }

    private move(delta: number) {
        const { innerWidth, innerHeight } = window;
        const { position } = this.sprite;

        position.x += this.vector.x * this.moveSpeed * delta;
        position.y += this.vector.y * this.moveSpeed * delta;

        this.vector.mult(0.96);

        position.set(
            (innerWidth + position.x) % innerWidth,
            (innerHeight + position.y) % innerHeight
        );
    }

    private rotate(delta: number) {
        const angle = this.vector.angle();
        const absAngle = Math.abs(angle);

        if (absAngle > Math.PI / 2 && absAngle <= Math.PI) {
            if (this.sprite.scale.y > 0) {
                this.invertFaceDirection();
            }
        } else if (this.sprite.scale.y < 0) {
            this.invertFaceDirection();
        }

        this.sprite.rotation = angle * delta;
    }

    private invertFaceDirection() {
        this.sprite.scale.y *= -1;
    }
}
