import BaseScene from "app/scenes/BaseScene";
import TextButtonControl from "app/controls/button/TextButtonControl";
import ChoiceScene from "app/scenes/ChoiceScene";
import { distance, Vector } from "app/helpers/math";
import { Container, DisplayObject } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import gameModel, { TOrientation } from "app/model/GameModel";
import { Graphics } from "@pixi/graphics";
import { Ticker } from "@pixi/ticker";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";
import { AnimatedSprite } from "@pixi/sprite-animated";

export default class GPacmanScene extends BaseScene {
    private readonly vector: Vector = new Vector(0.1, 0.1);
    private readonly dots: Array<Container> = [];
    private readonly enemyArray: Array<Container> = [];
    // private readonly pacman: Sprite = new Sprite();
    // private pacman: AnimatedSprite = {} as AnimatedSprite;// = new AnimatedSprite([]);
    private pacman: Sprite = new Sprite();// = new AnimatedSprite([]);
    private enemyBoss: Sprite = new Sprite();
    private bground: Sprite = new Sprite();
    private scoresCounter: number = 0;
    private dotRadius: number = 15;
    private scores: Text = new Text("");
    private speedFactor = 3;
    private diraction: string = "right";
    private isGameStart: boolean = false;
    private mainContainer = new Container();
    private gameContainer = new Container();
    private finishContainer = new Container();


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

        const createEnemy = (position: { x: number, y: number }) => {
            const enemyTexture = StrictResourcesHelper.getTexture("GPACMANICONS", "blinky.png");
            const enemy = new Sprite(enemyTexture);
            enemy.anchor.x = 0.5;
            enemy.anchor.y = 0.5;
            enemy.scale.set(0.17);
            enemy.position.set(position.x, position.y);
            return enemy;
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
        const titleStart = new Text("Click enter to start game!", style)
        const titleEnd = new Text("Game Over", style);
        const scores = new Text(`Scores: ${scoresCounter}`, style);
        const frame = new Graphics().lineStyle(2, 0x00FF00, 0.4).drawRect(2, 2, 800 - 4, 600 - 4);
        // const bgTexture = StrictResourcesHelper.getTexture("UI", "bg");
        const pacmanTexture1 = StrictResourcesHelper.getTexture("PACMAN", "pack1.png");
        const pacmanTexture2 = StrictResourcesHelper.getTexture("PACMAN", "pack2.png");
        const bgTexture = StrictResourcesHelper.getTexture("GPACMANICONS", "game_bg.png");
        const enemyBossTexture = StrictResourcesHelper.getTexture("GPACMANICONS", "enemyBoss.png");
        this.pacman = new AnimatedSprite([
            pacmanTexture1,
            pacmanTexture2,
        ], true);
        // const spriteBG = new Sprite(bgTexture);
        // const pacman = new Sprite(pacmanTexture1);
        const pacman = this.pacman;
        this.pacman.texture = pacmanTexture1;
        // this.enemyBoss.texture = enemyBossTexture;
        // this.pacman.animationSpeed = 1;
        /*        pacman.textures = [
                    pacmanTexture1, pacmanTexture2
                ];*/
        const dots = [];
        const enemy = [];
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
        titleStart.anchor.x = 0.5;
        titleEnd.anchor.x = 0.5;
        title.position.set(
            800 / 2,
            0
        );
        titleEnd.position.set(
            800 / 2,
            600 / 2
        );
        titleStart.position.set(
            800 / 2,
            600 / 2
        );
        this.bground.texture = bgTexture;
        // app.stage.addChild(mainContainer, finishContainer, gameContainer);
        // mainContainer.addChild(spriteBG, introText);
        // await delay(1);
        // introText.parent.removeChild(introText);

        this.gameContainer.addChild(titleStart);
        this.scene.addChild(this.gameContainer);
        //this.scene.addChild(title, scores, frame, pacman, emptySprite);
        // emptySprite.texture = bgTexture;
        // emptySprite.width = 100;
        // emptySprite.height = 100;
        // const offsets = 60;
        // const padding = 30;
        // for (let i = 0; i < 13; i++) {
        //     for (let j = 0; j < 10; j++) {
        //         let dot = createDot({x: i * offsets + padding, y: j * offsets + padding});
        //         this.scene.addChild(dot);
        //         dots.push(dot);
        //     }
        // }
        //pacman animation setup:
        setInterval(() => {
            pacman.texture = pacman.texture === pacmanTexture2 ? pacmanTexture1 : pacmanTexture2;
        }, 300);
        //game play setup:

        if (!this.isGameStart) {
            window.document.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    const enemyBoss = this.enemyBoss;
                    enemyBoss.anchor.x = 0.5;
                    enemyBoss.anchor.y = 0.5;
                    enemyBoss.scale.set(0.125);
                    enemyBoss.position.set(400 / 2, 300 / 2);

                    scoresCounter = 0;
                    pacman.anchor.x = 0.5;
                    pacman.anchor.y = 0.5;
                    pacman.scale.set(0.125);
                    pacman.position.set(800 / 2, 600 / 2);
                    scores.text = `Scores: ${scoresCounter}`;
                    this.isGameStart = true;
                    this.mainContainer.addChild(this.bground, title, scores, pacman, enemyBoss);
                    this.scene.removeChild(this.gameContainer);
                    this.scene.addChild(this.mainContainer);
                    const offsets = 60;
                    for (let i = 0; i < 13; i++) {
                        for (let j = 0; j < 10; j++) {
                            let dot = createDot({ x: i * offsets, y: j * offsets });
                            this.mainContainer.addChild(dot);
                            dots.push(dot);
                        }
                    }

                    for (let n = 0; n < 4; n++) {
                        let enemy;
                        let dist;
                        do {
                            enemy = createEnemy({ x: Math.random() * (600 - n * 50) + (n * 20), y: Math.random() * (600 - n * 50) + (n * 20) });
                            dist = distance(pacman.position, enemy.position);
                        } while ((dist < pacman.width * 0.5 + 5));
                        this.mainContainer.addChild(enemy);
                        this.enemyArray.push(enemy);
                        enemy.scale.x *= -1;
                        animationEnemyWalk(enemy);
                    }
                    if (this.isGameStart) {
                        window.document.addEventListener('keydown', pacmanControl);
                    }
                    // this.scene.addChild(mainContainer);
                    // const offsets = 60;
                    // for (let i = 0; i < 13; i++) {
                    //     for (let j = 0; j < 10; j++) {
                    //         let dot = createDot({ x: i * offsets, y: j * offsets });
                    //         mainContainer.addControl(dot);
                    //         dots.push(dot);
                    //     }
                    // }
                    // for (let n = 0; n < 4; n++) {
                    //     let enemy;
                    //     let dist;
                    //     do {
                    //         enemy = createEnemy({ x: Math.random() * (600 - n * 50) + (n * 20), y: Math.random() * (600 - n * 50) + (n * 20) });
                    //         dist = distance(pacman.position, enemy.position);
                    //     } while ((dist < pacman.width * 0.5 + 5));
                    //     mainContainer.addControl(enemy);
                    //     enemyArray.push(enemy);
                    //     enemy.scale.x *= -1;
                    //     animationEnemyWalk(enemy);
                    // }
                    // if (isGameStart) {
                    //     window.document.addEventListener('keydown', pacmanControl);
                    // }
                }
            };//end
        }
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
    protected  animationEnemyWalk(enemy: DisplayObject) {
        const offset = 1;
        new  Ticker.add(() => {
            enemy.position.x += offset;
            enemy.position.x = (800 + enemy.position.x) % 800;
        });
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