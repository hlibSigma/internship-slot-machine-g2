import { Sprite } from "@pixi/sprite";
import { AnimatedSprite } from "@pixi/sprite-animated";

import MainControl from "app/controls/MainControl";
import Resources from "app/pixi/StrictResourcesHelper";
import PacmanControl from "app/controls/OS/PacmanControl";
import { lerp, distance } from "app/helpers/math";
import { gameSize } from "app/Main";
import TweenMax from "gsap";

export default class GhostControl extends MainControl {
    readonly sprite: AnimatedSprite;
    private readonly moveSpeed: number;
    private readonly target: Sprite;

    constructor(pacman: PacmanControl) {
        super();

        const textures = Resources.getAnimation(
            "OS_ATLAS",
            "ghost"
        );

        this.sprite = new AnimatedSprite(textures);
        this.sprite.animationSpeed = 1000;

        this.moveSpeed = pacman.moveSpeed * 0.6;
        this.target = pacman.sprite;

        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.8);
        this.sprite.play();

        this.animate();
        this.resetPosition();

        this.container.addChild(this.sprite)
    }

    update(delta: number) {
        this.move(delta);
        this.rotate();
    }

    checkCollision() {
        const dist = distance(this.target.position, this.sprite.position);
        return dist < this.target.width / 2 + this.sprite.width / 2;
    }

    private move(delta: number) {
        const { position } = this.sprite;
        const step = this.moveSpeed * 0.01 * delta;

        position.set(
            lerp(position.x, this.target.position.x, step),
            lerp(position.y, this.target.position.y, step)
        );
    }

    private animate(intensity = 0.8, duration = 4) {
        TweenMax.to(this.sprite, duration, {
            alpha: 1 - intensity,
            yoyo: true,
            repeat: -1,
        });
    }

    private rotate() {
        const posX = this.sprite.position.x;
        const targetX = this.target.position.x;
        const scaleX = this.sprite.scale.x;

        if (posX > targetX && scaleX > 0) {
            this.swapFaceDirection();
        } else if (posX < targetX && scaleX < 0) {
            this.swapFaceDirection();
        }
    }

    private swapFaceDirection() {
        this.sprite.scale.x *= -1;
    }

    private resetPosition() {
        this.sprite.position.set(-this.sprite.width, gameSize.height / 2);
    }
}