import BaseScene from "app/scenes/BaseScene";
import ButtonControl from "app/controls/button/ButtonControl";
import TextButtonControl from "app/controls/button/TextButtonControl";
import ChoiceScene from "app/scenes/ChoiceScene";
import {distance, Vector} from "app/helpers/math";
import {Container} from "@pixi/display";
import {Sprite} from "@pixi/sprite";
import {Graphics} from "@pixi/graphics";
import {Text} from "@pixi/text";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";
import {AnimatedSprite} from "@pixi/sprite-animated";
import gameModel, {TOrientation} from "app/model/GameModel";

export default class GameScene extends BaseScene {
    private readonly vector: Vector = new Vector(0.1, 0.1);
    private readonly dots: Array<Container> = [];
    // private readonly pacman: Sprite = new Sprite();
    // private pacman: AnimatedSprite = {} as AnimatedSprite;// = new AnimatedSprite([]);
    private pacman: Sprite = new Sprite();// = new AnimatedSprite([]);
    private scoresCounter: number = 0;
    private dotRadius: number = 15;
    private scores: Text = new Text("");
    private speedFactor = 3;

    compose(): void {
        const textButtonControl = new TextButtonControl("Back");
        this.addControl(textButtonControl);
        textButtonControl.container.position.set(100, 100);
        textButtonControl.onClick.add(this.onBackBtnClick, this);
        document.body.addEventListener("keypress", (e) => {
            let data:TOrientation = "down";
            console.log(e.type, e.key);
            switch (e.key.toUpperCase()) {
                case "A":
                    data = "left";
                    break;
                case "D":
                    data = "right";
                    break;
                case "W":
                    data = "up";
                    break;
                case "S":
                    data = "down";
                break;
                default:
                    return;
            }
            this.onUpdateOrientation(data)
        });

        gameModel.updateOrientation.add(this.onUpdateOrientation, this);
        gameModel.setSpeedFactor.add(this.onSetSpeedFactor, this);
    }

    private onSetSpeedFactor(speedFactor:number) {
        this.speedFactor = speedFactor;
    }

    private onUpdateOrientation(data:TOrientation) {
        const vector = this.vector;
        console.log("orientation", data);
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
        console.log(vector);
    }

    activate() {
        console.warn("GameScene", "activate");
        super.activate();
        const dotRadius = 5;
        let scoresCounter = 0;
        // const vector = new Vector(0, 0);
        const emptySprite = new Sprite();
        // const loader = PIXI.Loader.shared;
        const createDot = (position:{x:number, y:number}) => {
            const dot = new Graphics().beginFill(0xffff00).drawCircle(
                0,
                0,
                dotRadius
            );
            dot.position.set(position.x, position.y);
            return dot;
        };
        // createPixiApplication();
        //loader stuff:
        /*loader.add('BG', 'images/game_bg.png');
        loader.add('PAC1', 'images/pack1.png');
        loader.add('PAC2', 'images/pack2.png');
        const loaderPromise = new Promise(resolve => {
            loader.onComplete.add((e) => {
                resolve();
            });
        });
        loader.load();
        await loaderPromise;*/
        //scene construct stuff:
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
        const introText = new Text("Welcome to the game", style);
        const scores = new Text(`Scores: ${scoresCounter}`, style);
        const frame = new Graphics().lineStyle(2, 0x00FF00, 0.4).drawRect(2, 2, 800 - 4, 600 - 4);
        // const bgTexture = StrictResourcesHelper.getTexture("UI", "bg");
        const pacmanTexture1 = StrictResourcesHelper.getTexture("PACMAN", "pack1.png");
        const pacmanTexture2 = StrictResourcesHelper.getTexture("PACMAN", "pack2.png");
        this.pacman = new AnimatedSprite([
            pacmanTexture1,
            pacmanTexture2,
        ], true);
        // const spriteBG = new Sprite(bgTexture);
        // const pacman = new Sprite(pacmanTexture1);
        const pacman = this.pacman;
        this.pacman.texture = pacmanTexture1;
        // this.pacman.animationSpeed = 1;
/*        pacman.textures = [
            pacmanTexture1, pacmanTexture2
        ];*/
        const dots = [];
        pacman.anchor.x = 0.5;
        pacman.anchor.y = 0.5;
        pacman.scale.set(0.125);
        pacman.position.set(800 / 2, 600 / 2);
        // pacman.texture = pacmanTexture2;
        title.anchor.x = 0.5;
        title.position.set(
            800 / 2,
            0
        );
        introText.anchor.x = 0.5;
        introText.anchor.y = 1.5;
        introText.style.fontSize = 50;
        introText.position.set(
            800 / 2,
            600 / 2
        );
        scores.anchor.x = 1;
        scores.position.set(
            800 - 4,
            0
        );
        // app.stage.addChild(mainContainer, finishContainer, gameContainer);
        // mainContainer.addChild(spriteBG, introText);
        // await delay(1);
        // introText.parent.removeChild(introText);
        this.scene.addChild(title, scores, frame, pacman, emptySprite);
        // emptySprite.texture = bgTexture;
        // emptySprite.width = 100;
        // emptySprite.height = 100;
        const offsets = 60;
        const padding = 30;
        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 10; j++) {
                let dot = createDot({x: i * offsets + padding, y: j * offsets + padding});
                this.scene.addChild(dot);
                dots.push(dot);
            }
        }
        //pacman animation setup:
        setInterval(() => {
            pacman.texture = pacman.texture === pacmanTexture2 ? pacmanTexture1 : pacmanTexture2;
        }, 300);
        //game play setup:


        // const ticker = new PIXI.Ticker();
        // ticker.add(() => {
        //     updatePositions();
        // });
        // ticker.add(() => {
        //     checkMath();
        // });
        // ticker.start();
        console.warn("GameScene", "activate end");
    }

    private onBackBtnClick() {
        this.sceneManager.navigate(ChoiceScene);
    }

    protected onUpdate(delta: number) {
        super.onUpdate(delta);
        // this.pacman.update(delta);
        this.checkMath();
        this.updatePositions();
    }
    protected checkMath():void  {
        this.dots.slice().forEach(dot => {
            const dist = distance(this.pacman.position, dot.position);
            if (dist < this.pacman.width * .5 + this.dotRadius) {
                this.scene.removeChild(dot);
                this.scoresCounter++;
                this.scores.text = `Scores: ${this.scoresCounter}`;
                this.dots.splice(this.dots.indexOf(dot), 1);
                // pacman.scale.x = pacman.scale.y += 0.001;
            }
        });
    }

    protected updatePositions():void {
        console.log("updatePositions", this.vector);
        const pacman = this.pacman;
        const vector = this.vector;
        pacman.position.x += vector.x * this.speedFactor;
        pacman.position.y += vector.y * this.speedFactor;
        // vector.mult(0.98);
        pacman.position.x = (800 + pacman.position.x) % 800;
        pacman.position.y = (600 + pacman.position.y) % 600;

        pacman.rotation = vector.angle();
    }

}