import { AnimatedSprite } from "@pixi/sprite-animated";
import { Vector } from "app/helpers/math";
import MainControl from "../MainControl";
import Resources from "app/pixi/StrictResourcesHelper";

export default class PacmanControl extends MainControl {
    readonly sprite: AnimatedSprite;
    readonly speed = 3;
    private readonly moveVector = new Vector(0, 0);

    constructor() {
        super();
        const textures = Resources.getAnimation("PACMAN", "pack");

        this.sprite = new AnimatedSprite(textures);
        this.sprite.animationSpeed = 100;

        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.2);

        this.sprite.position.set(window.innerWidth / 2, window.innerHeight / 2);

        this.sprite.play();
        this.control();

        this.container.addChild(this.sprite);
    }

    private control() {
        window.document.addEventListener("keydown", ({ key }) => {
            switch (key) {
                case "ArrowUp":
                    this.moveVector.y = -1;
                    this.moveVector.x = 0;
                    break;
                case "ArrowLeft":
                    this.moveVector.x = -1;
                    this.moveVector.y = 0;
                    break;
                case "ArrowDown":
                    this.moveVector.y = 1;
                    this.moveVector.x = 0;
                    break;
                case "ArrowRight":
                    this.moveVector.x = 1;
                    this.moveVector.y = 0;
                    break;

                default:
                    return;
            }
        });
    }

    positionUpdate(delta: number) {
        this.move(delta);
        this.rotate();
    }

    private move(delta: number) {
        const { position } = this.sprite;

        position.x += this.moveVector.x * this.speed * delta;
        position.y += this.moveVector.y * this.speed * delta;
    }

    private rotate() {
        const angle = this.moveVector.angle();
        const vector = this.moveVector;

        if (vector.x < 0) {
            this.sprite.scale.y = -0.2;
        } else {
            this.sprite.scale.y = 0.2;
        }

        this.sprite.rotation = angle;
    }
}
