import BaseScene from "app/scenes/BaseScene";
import TextButtonControl from "app/controls/button/TextButtonControl";
import ChoiceScene from "app/scenes/ChoiceScene";
import {distance, Vector} from "app/helpers/math";
import {Container, DisplayObject} from "@pixi/display";
import {Sprite} from "@pixi/sprite";
import {Graphics} from "@pixi/graphics";
import {ITextStyle, Text} from "@pixi/text";
import {AnimatedSprite} from "@pixi/sprite-animated";
import gameModel, {GameSize, TOrientation} from "app/model/GameModel";
import {inject} from "app/model/injection/InjectDecorator";
import LayoutManager, {PartialLayout} from "app/layoutManager/LayoutManager";
import gsap from "gsap";
import {Loader} from "@pixi/loaders";
import {Texture} from "@pixi/core";
import pgsap from "app/helpers/promise/gsap/PromisableGsap";
import {PivotType} from "app/controls/MainControl";
import {Point} from "@pixi/math";
import {promiseDelay} from "app/helpers/TimeHelper";

export default class GameScene extends BaseScene {
    private readonly commonLayouts: PartialLayout[] = [{
        name: "box",
        uid: "box",
        scaleBy: "fit.in",
        height: "98%",
        width: "98%",
        top: "1%",
        left: "1%",
    }];
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
            display: "relative",
            layouts: [
                {
                    name: "leftBox",
                    extend: "box",
                    align: "l",
                    alignIn: "l",
                    width: 100,
                    layouts: [{
                        name: "backBtn",
                        extend: "box",
                        width: 100,
                    }]
                },
                {
                    name: "centerBox",
                    extend: "box",
                    align: "c",
                    alignIn: "c",
                    width: "80%",
                    layouts: [{
                        name: "title",
                        extend: "box",
                        width: 300,
                        align: "c",
                    }]
                },
                {
                    name: "rightBox",
                    extend: "box",
                    align: "r",
                    alignIn: "r",
                    layouts: [{
                        name: "scores",
                        extend: "box",
                        width: 300,
                    }],
                }
            ]
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
    private pacman: AnimatedSprite = {} as AnimatedSprite;// = new AnimatedSprite([]);
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
        const textButtonControl = new TextButtonControl("Back", {align: PivotType.TL})
            .name("backBtn");
        this.addControl(textButtonControl);
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

        let style: Partial<ITextStyle> = {
            fill: [
                "#53b512",
                "#c70000"
            ],
            fillGradientStops: [
                0.2
            ],
            stroke: "white",
            strokeThickness: 1,
            fontSize: 100
        };
        const title = new Text("PACMAN", style);
        const scores = new Text(`Scores: ${scoresCounter}`, style);
        const frame = new Graphics().lineStyle(2, 0x00FF00, 0.4).drawRect(2, 2, 800 - 4, 600 - 4);
        const animations: Texture[] = <Texture[]>Loader.shared.resources["PACMAN"]?.spritesheet?.animations.pack;
        this.pacman = new AnimatedSprite(animations, true);
        this.pacman.animationSpeed = 0.05;
        this.pacman.play();
        const pacman = this.pacman;
        pacman.anchor.x = 0.5;
        pacman.anchor.y = 0.5;
        pacman.scale.set(0.125);
        pacman.position.set(800 / 2, 600 / 2);
        title.name = "title";
        scores.name = "scores";
        this.scores = scores;
        this.scene.addChild(this.mainContainer, title, scores);
        this.mainContainer.addChild(frame, pacman, emptySprite);
        const offsets = 60;
        const padding = 30;
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 10; j++) {
                let dot = this.createDot({x: i * offsets + padding, y: j * offsets + padding});
                this.mainContainer.addChildAt(dot, 0);
                this.dots.push(dot);
            }
        }
        this.spawnTimeoutId = setInterval(this.addNewDot.bind(this), 1000);
        this.mainContainer.name = "game";
        this.layoutManager.addLayout(...this.commonLayouts);
        this.layoutManager.addLayout(this.layouts);
    }

    createDot(position: {x: number, y: number}, color: number = 0xffff00) {
        const dot = new Graphics()
            .lineStyle(1, 0x555555, 0.8)
            .beginFill(color)
            .drawCircle(
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
        let howler = gameModel.getHowler();
        let soundId = howler.play("water_step");
        howler.volume(0.5, soundId);
        let dot = this.createDot(this.pacman.position, 0xff0000);
        this.mainContainer.addChildAt(dot, 0);
        this.scoresCounter--;
        setTimeout(() => {
            this.dots.push(dot);
            this.updateScores();
        }, 1000);
    }

    deactivate() {
        this.layoutManager.removeLayout(this.layouts);
        clearInterval(this.spawnTimeoutId);
        super.deactivate();
    }

    private onBackBtnClick() {
        this.sceneManager.navigate(ChoiceScene);
    }

    protected onUpdate(delta: number) {
        delta = Math.min(delta, 1);
        super.onUpdate(delta);
        this.checkMath();
        this.updatePositions(delta);
        this.orientations.forEach(value => this.updateOrientation(value));
    }

    protected onResize(gameSize: GameSize) {
        super.onResize(gameSize);
    }

    protected checkMath(): void {
        this.dots.slice().forEach(async dot => {
            const dist = distance(this.pacman.position, dot.position);
            if (dist < this.pacman.width * .5 + this.dotRadius) {
                this.dots.splice(this.dots.indexOf(dot), 1);
                let vector = new Vector(this.pacman.position.x, this.pacman.position.y).sub(new Vector(dot.position.x, dot.position.y));
                this.vector.add(vector.normalize().mult(0.5));
                this.speedFactor += 0.125;
                gsap.killTweensOf(this);
                gsap.to(this, {
                    duration: 3,
                    speedFactor: this.originSpeedFactor,
                });
                this.vector.normalize();
                this.updateScores();
                clearInterval(this.spawnTimeoutId);
                this.spawnTimeoutId = setInterval(this.addNewDot.bind(this), 1000);
                gameModel.getHowler().play("pop" + (Math.round(Math.random() * 4) + 1))
                let offsets = {offsetX: -(this.scores.width - 30), offsetY: -this.scores.height * .5};
                await this.moveTo(dot, this.scores, offsets);
                this.mainContainer.removeChild(dot);
                this.scoresCounter++;
                if (this.dots.length == 0) {
                    gameModel.getHowler().play("success");
                    await promiseDelay(1.5);
                    this.sceneManager.navigate(ChoiceScene);
                }
            }
        });
    }

    protected async moveTo(dot: Container, to: Container, offsets?: {offsetX?: number, offsetY?: number}) {
        offsets = offsets ?? {offsetX: 0, offsetY: 0};
        offsets.offsetX = offsets.offsetX ?? 0;
        offsets.offsetY = offsets.offsetY ?? 0;
        let localPosition = this.getLocalPosition(to, offsets.offsetX, offsets.offsetY);
        const duration = 1.75 + Math.random() * 0.5;
        const ease = `back.inOut(${Math.random() * .5 + 1})`;
        return Promise.all([
            pgsap.to(dot, {
                duration,
                x: localPosition.x,
                ease,
            }),
            pgsap.to(dot, {
                duration,
                y: localPosition.y,
                ease,
            }),
        ]);
    }

    protected getLocalPosition(displayObject: DisplayObject, offsetX: number = 0, offsetY: number = 0, where?: Container): Point {
        let result;
        if (offsetX != 0 || offsetY != 0) {
            const oldX: number = displayObject.x;
            const oldY: number = displayObject.y;
            displayObject.x -= offsetX;
            displayObject.y -= offsetY;
            result = displayObject.getGlobalPosition();
            displayObject.x = oldX;
            displayObject.y = oldY;
        } else {
            result = displayObject.getGlobalPosition();
        }

        result.set(
            result.x / this.mainContainer.parent.scale.x,
            result.y / this.mainContainer.parent.scale.y
        );
        where = where ? where : this.mainContainer;
        return where.toLocal(result);
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
    }

    private updateScores() {
        this.scores.text = `Scores: ${this.scoresCounter}`;
    }
}