import BaseScene from "app/scenes/BaseScene";
import TextButtonControl from "app/controls/button/TextButtonControl";
import ChoiceScene from "app/scenes/ChoiceScene";
import {distance, Vector} from "app/helpers/math";
import {Container} from "@pixi/display";
import {Sprite} from "@pixi/sprite";
import {Graphics} from "@pixi/graphics";
import {Text} from "@pixi/text";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";
import {AnimatedSprite} from "@pixi/sprite-animated";
import gameModel, {GameSize, TOrientation} from "app/model/GameModel";
import {inject} from "app/model/injection/InjectDecorator";
import LayoutManager, {PartialLayout} from "app/layoutManager/LayoutManager";
import gsap from "gsap";

export default class GameScene extends BaseScene {
    private readonly layouts: PartialLayout = {
        name: "body",
        display: "relative",
        height: "80%",
        width: "80%",
        top: "10%",
        left: "10%",
        sortBy: "vertical",
        layouts: [{
            name: "gameBar",
            height: 100,
            width: "100%",
        }, {
            name: "gameBody",
            width: "100%",
            height: "100%",
            alignIn: "tr",
            layouts: [
                {
                    name: "game",
                    width: "96%",
                    height: "96%",
                    top: "2%",
                    left: "2%",
                    scaleBy: "height",
                    alignIn: "c",

                    aspects: {
                        "1270/958": {
                            scaleBy: "height",
                        },
                        "1270/959": {
                            scaleBy: "width",
                        }
                    },
                }
            ]
        }]
    };

    private readonly vector: Vector = new Vector(0.1, 0.1);
    private readonly dots: Array<Container> = [];
    // private readonly pacman: Sprite = new Sprite();
    // private pacman: AnimatedSprite = {} as AnimatedSprite;// = new AnimatedSprite([]);
    private pacman: Sprite = new Sprite();// = new AnimatedSprite([]);
    private scoresCounter: number = 0;
    private dotRadius: number = 5;
    private scores: Text = new Text("");
    private readonly originSpeedFactor = 3;
    private speedFactor = 3;
    private mainContainer: Container = new Container();
    @inject(LayoutManager)
    private layoutManager: LayoutManager = <any>{};
    private spawnTimeoutId: number = -1;
    private orientations: TOrientation[] = [];

    compose(): void {
        const textButtonControl = new TextButtonControl("Back");
        this.addControl(textButtonControl);
        textButtonControl.container.position.set(100, 100);
        textButtonControl.onClick.add(this.onBackBtnClick, this);
        const keyPressMap = new Map<string, TOrientation>();
        keyPressMap.set("A", "left");
        keyPressMap.set("D", "right");
        keyPressMap.set("S", "down");
        keyPressMap.set("W", "up");
        document.body.addEventListener("keyup", (e) => {
            const data: TOrientation | undefined = keyPressMap.get(e.key.toUpperCase());
            if (!data) {
                return;
            }
            let start = this.orientations.indexOf(data);
            this.orientations.splice(start, 1);
        });
        document.body.addEventListener("keydown", (e) => {
            const data: TOrientation | undefined = keyPressMap.get(e.key.toUpperCase());
            if (!data || this.orientations.indexOf(data) >= 0) {
                return;
            }
            this.orientations.push(data);
        });

        gameModel.updateOrientation.add(this.updateOrientation, this);
        gameModel.setSpeedFactor.add(this.onSetSpeedFactor, this);
    }

    private onSetSpeedFactor(speedFactor: number) {
        this.speedFactor = speedFactor;
    }

    private updateOrientation(data: TOrientation) {
        const vector = this.vector;
        let offset = 0.25;
        switch (data) {
            case "left":
                vector.x -= offset;
                break;
            case "right":
                vector.x += offset;
                break;
            case "up":
                vector.y -= offset;
                break;
            case "down":
                vector.y += offset;
                break;
            default:
                return;
        }
        vector.normalize();
    }

    activate() {
        super.activate();
        let scoresCounter = 0;
        const emptySprite = new Sprite();

        let style = {
            fill: [
                "#53b512",
                "#c70000"
            ],
            fillGradientStops: [
                0.2
            ],
            stroke: "white",
            strokeThickness: 1
        };
        const title = new Text("Game Title", style);
        const scores = new Text(`Scores: ${scoresCounter}`, style);
        const frame = new Graphics().lineStyle(2, 0x00FF00, 0.4).drawRect(2, 2, 800 - 4, 600 - 4);
        const pacmanTexture1 = StrictResourcesHelper.getTexture("PACMAN", "pack1.png");
        const pacmanTexture2 = StrictResourcesHelper.getTexture("PACMAN", "pack2.png");
        this.pacman = new AnimatedSprite([
            pacmanTexture1,
            pacmanTexture2,
        ], true);
        const pacman = this.pacman;
        this.pacman.texture = pacmanTexture1;
        pacman.anchor.x = 0.5;
        pacman.anchor.y = 0.5;
        pacman.scale.set(0.125);
        pacman.position.set(800 / 2, 600 / 2);
        title.anchor.x = 0.5;
        title.position.set(
            800 / 2,
            0
        );
        scores.anchor.x = 1;
        scores.position.set(
            800 - 4,
            0
        );
        this.scores = scores;
        this.scene.addChild(this.mainContainer);
        this.scene.addChild(title, scores, frame, pacman, emptySprite);
        const offsets = 60;
        const padding = 30;
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 10; j++) {
                let dot = this.createDot({x: i * offsets + padding, y: j * offsets + padding});
                this.scene.addChild(dot);
                this.dots.push(dot);
            }
        }
        setInterval(() => {
            pacman.texture = pacman.texture === pacmanTexture2 ? pacmanTexture1 : pacmanTexture2;
        }, 300);
        this.spawnTimeoutId = setInterval(this.addNewDot.bind(this), 1000);
        this.scene.name = "game";
        this.layoutManager.addLayout(this.layouts);
    }

    createDot(position: {x: number, y: number}, color: number = 0xffff00) {
        const dot = new Graphics().beginFill(color).drawCircle(
            0,
            0,
            this.dotRadius
        );
        dot.position.set(position.x, position.y);
        return dot;
    };

    private addNewDot() {
        if (this.scoresCounter <= 0) {
            return;
        }
        let dot = this.createDot(this.pacman.position, 0xff0000);
        this.scene.addChildAt(dot, 0);
        this.scoresCounter--;
        setTimeout(() => {
            this.dots.push(dot);
            this.updateScores();
        }, 1000);
    }

    deactivate() {
        this.layoutManager.removeLayout(this.layouts);
        super.deactivate();
    }

    private onBackBtnClick() {
        this.sceneManager.navigate(ChoiceScene);
    }

    protected onUpdate(delta: number) {
        super.onUpdate(delta);
        this.checkMath();
        this.updatePositions(delta);
        this.orientations.forEach(value => this.updateOrientation(value));
    }

    protected onResize(gameSize: GameSize) {
        super.onResize(gameSize);
    }

    protected checkMath(): void {
        this.dots.slice().forEach(dot => {
            const dist = distance(this.pacman.position, dot.position);
            if (dist < this.pacman.width * .5 + this.dotRadius) {
                this.scene.removeChild(dot);
                this.scoresCounter++;
                this.dots.splice(this.dots.indexOf(dot), 1);
                let vector = new Vector(this.pacman.position.x, this.pacman.position.y).sub(new Vector(dot.position.x, dot.position.y));
                this.vector.add(vector.normalize().mult(0.5));
                this.speedFactor += 0.25;
                gsap.killTweensOf(this);
                gsap.to(this, {
                    duration: 3,
                    speedFactor: this.originSpeedFactor,
                });
                this.vector.normalize();
                this.updateScores();
                clearInterval(this.spawnTimeoutId);
                this.spawnTimeoutId = setInterval(this.addNewDot.bind(this), 1000);
            }
        });
    }

    protected updatePositions(dt: number): void {
        const pacman = this.pacman;
        const vector = this.vector;
        pacman.position.x += (vector.x * this.speedFactor) * dt;
        pacman.position.y += (vector.y * this.speedFactor) * dt;
        // vector.mult(0.98);
        pacman.position.x = (800 + pacman.position.x) % 800;
        pacman.position.y = (600 + pacman.position.y) % 600;

        pacman.rotation = vector.angle();
        pacman.scale.y = (vector.x < 0 ? -1 : 1) * 0.125
        console.log(vector.angle());
    }

    private updateScores() {
        this.scores.text = `Scores: ${this.scoresCounter}`;
    }
}