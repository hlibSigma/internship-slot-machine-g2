import BaseScene from "app/scenes/BaseScene";
import TextButtonControl from "app/controls/button/TextButtonControl";
import ChoiceScene from "app/scenes/ChoiceScene";
import { distance, Vector } from "app/helpers/math";
import { Container, DisplayObject } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { Text } from "@pixi/text";
import gameModel, { GameSize, TOrientation } from "app/model/GameModel";
import { Graphics } from "@pixi/graphics";
import { Ticker } from "@pixi/ticker";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";
import { AnimatedSprite } from "@pixi/sprite-animated";
import { Loader } from "@pixi/loaders";


export default class MSPacmanScene extends BaseScene {
    

    private readonly vector: Vector = new Vector(0, 0);
    private dots: Array<Container> = [];
    private pacman: Sprite = new Sprite();
    private readonly enemyBoss: Sprite = new Sprite();
    private readonly bground: Sprite = new Sprite();
    private titleEnd = new Text("Game over");
    private scoresCounter: number = 0;
    private dotRadius: number = 7;
    private scores: Text = new Text("");
    private speedFactor = 5;
    private direction: string = "right";
    private isGameStart: boolean = false;
    private readonly mainContainer = new Container();
    private readonly gameContainer = new Container();
    private readonly finishContainer = new Container();


    compose(): void {
        const textButtonControl = new TextButtonControl("Back");
        this.addControl(textButtonControl);
        textButtonControl.container.position.set(100, 100);
        textButtonControl.onClick.add(this.onBackBtnClick, this);
        window.document.addEventListener('keydown', (e) => {
            let offset = 0.5;
            switch (e.key) {
                case "ArrowLeft":
                    this.vector.x -= offset;
                    break;
                case "ArrowRight":
                    this.vector.x += offset;
                    break;
                case "ArrowUp":
                    this.vector.y -= offset;
                    break;
                case "ArrowDown":
                    this.vector.y += offset;
                    break;
                default:
                    return;
            }

            const orientationLeft = Math.abs(this.vector.angle()) > (Math.PI / 2);
            if (orientationLeft) {
                if (this.direction === "right") {
                    this.pacman.scale.y *= -1;
                    this.direction = "left";
                }
            }

            const orientationRight = Math.abs(this.vector.angle()) < (Math.PI / 2);
            if (orientationRight) {
                if (this.direction === "left") {
                    this.pacman.scale.y *= -1;
                    this.direction = "right";
                }
            }

            this.vector.normalize();
            this.pacman.rotation = this.vector.angle();
        });

        gameModel.updateOrientation.add(this.onUpdateOrientation, this);
        gameModel.setSpeedFactor.add(this.onSetSpeedFactor, this);
    }

    private onSetSpeedFactor(speedFactor: number) {
        this.speedFactor = speedFactor;
    }

    private onUpdateOrientation(data: TOrientation) {
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

    private enemyBossTexture = StrictResourcesHelper.getTexture("GPACMANICONS", "enemyBoss.png")
    private style = {
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
    private title = new Text("MS Pacman", this.style);
    private pacmanTexture1 = StrictResourcesHelper.getTexture("PACMAN", "pack1.png");
    private pacmanTexture2 = StrictResourcesHelper.getTexture("PACMAN", "pack2.png");

    private gamestart = () => {
        this.dots = [];
        this.scoresCounter = 0;
        const enemyBoss = this.enemyBoss;
        enemyBoss.texture = this.enemyBossTexture;
        enemyBoss.anchor.x = 0.5;
        enemyBoss.anchor.y = 0.5;
        enemyBoss.scale.set(0.125);
        enemyBoss.position.set(400 / 2, 300 / 2);
        this.pacman = new AnimatedSprite([
            this.pacmanTexture1,
            this.pacmanTexture2,
        ], true);
        this.pacman.anchor.x = 0.5;
        this.pacman.anchor.y = 0.5;
        this.pacman.scale.set(0.125);
        this.pacman.position.set(800 / 2, 600 / 2);
        this.scores.text = `Scores: ${this.scoresCounter}`;
        this.isGameStart = true;
        this.mainContainer.addChild(this.bground, this.title, this.scores, this.pacman, enemyBoss);
        this.scene.removeChild(this.gameContainer);
        this.scene.addChild(this.mainContainer);
        let offsets = 180;
        for (let i = 1; i < 5; i++) {
            for (let j = 1; j < 6; j++) {
                let dot = this.createDot({x: i * offsets, y: j * offsets / 2});
                this.mainContainer.addChild(dot);
                this.dots.push(dot);
            }
        }
    }
    
    private createDot = (position: {x: number, y: number}) => {
            const dot = new Graphics().beginFill(0xff0000).drawCircle(
                0,
                0,
                this.dotRadius
            );
            dot.position.set(position.x, position.y);
            return dot;
    };
    
    activate() {
        super.activate();      

        
        
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

        const introText = new Text("Welcome to the game", this.style);
        const titleStart = new Text("START", this.style)
        titleStart.scale.set(3);
        this.titleEnd = new Text("Game Over", this.style);
        this.titleEnd.position.set(
            800 / 2,
            600 / 2
        );
        this.titleEnd.anchor.x = 0.5;
        this.finishContainer.addChild(this.titleEnd);
        this.scores = new Text(`Scores: ${this.scoresCounter}`, this.style);
        const bgTexture = StrictResourcesHelper.getTexture("GPACMANICONS", "game_bg.png");
        
        this.title.anchor.x = 0.5;
        this.title.position.set(
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
        titleStart.position.set(
            800 / 2,
            600 / 2
        );

        this.scores.anchor.x = 1;
        this.scores.position.set(
            800 - 4,
            0
        );
        titleStart.anchor.x = 0.5;
        
        this.bground.texture = bgTexture;
        this.gameContainer.addChild(titleStart);
        this.scene.addChild(this.gameContainer);

        this.addToTicker(()=>{this.pacman.texture = this.pacman.texture === this.pacmanTexture2 ? this.pacmanTexture1 : this.pacmanTexture2}, {interval:300});

        if (!this.isGameStart) {
            titleStart.interactive = true;
            titleStart.on('mousedown', this.gamestart)
        }
    }

    private onBackBtnClick() {
        this.sceneManager.navigate(ChoiceScene);
    }
   
    protected onUpdate(delta: number) {
        super.onUpdate(delta);
        this.checkMath();
        this.checkBite();
        this.enemyBossWalk();
        this.updatePositions();
    }

    protected enemyBossWalk(): void {
        const offset = 2;

        const vectorEnemyPossibleX = new Vector(this.enemyBoss.position.x + offset, this.enemyBoss.position.y);
        const vectorEnemyPossibleNegativeX = new Vector(this.enemyBoss.position.x - offset, this.enemyBoss.position.y);
        const vectorEnemyPossibleY = new Vector(this.enemyBoss.position.x, this.enemyBoss.position.y + offset);
        const vectorEnemyPossibleNegativeY = new Vector(this.enemyBoss.position.x, this.enemyBoss.position.y - offset);

        const distanceEnemyPossibleX = distance(vectorEnemyPossibleX, this.pacman);
        const distanceEnemyPossibleNegativeX = distance(vectorEnemyPossibleNegativeX, this.pacman);
        const distanceEnemyPossibleY = distance(vectorEnemyPossibleY, this.pacman);
        const distanceEnemyPossibleNegativeY = distance(vectorEnemyPossibleNegativeY, this.pacman);

        const allEnemyPossibleMove = [
            {
                vector: vectorEnemyPossibleX,
                distance: distanceEnemyPossibleX
            },
            {
                vector: vectorEnemyPossibleNegativeX,
                distance: distanceEnemyPossibleNegativeX
            },
            {
                vector: vectorEnemyPossibleY,
                distance: distanceEnemyPossibleY
            },
            {
                vector: vectorEnemyPossibleNegativeY,
                distance: distanceEnemyPossibleNegativeY
            }
        ]
        let minDistObject = allEnemyPossibleMove[0];

        allEnemyPossibleMove.forEach(possibleMove => {
            if (possibleMove.distance < minDistObject.distance) {
                minDistObject = possibleMove;
            }
        })
        this.enemyBoss.position.x = minDistObject.vector.x;
        this.enemyBoss.position.y = minDistObject.vector.y;
        minDistObject.vector.mult(0.98);
        this.enemyBoss.position.x = (800 + this.enemyBoss.position.x) % 800;
        this.enemyBoss.position.y = (600 + this.enemyBoss.position.y) % 600;

    }

    protected checkMath(): void {
        this.dots.slice().forEach(dot => {
            const dist = distance(this.pacman.position, dot.position);
            if (dist < this.pacman.width * .5 + this.dotRadius) {
                this.flyToScore(dot);
                this.scoresCounter++;
                if (this.scoresCounter <= 10) {
                    this.animationScore(this.scoresCounter);
                    this.dots.splice(this.dots.indexOf(dot), 1);
                } else {
                    this.endGame("win");
                }
            }
        });
    }

    protected checkBite(): void {
        const distBoss = distance(this.pacman.position, this.enemyBoss.position);

        if ((distBoss < this.pacman.width * 0.5 + this.enemyBoss.width*0.5 + 10) && this.isGameStart) {
            this.endGame("lose");
        }
    }

    protected flyToScore(dot: DisplayObject) {
        let deltaX = (this.scores.position.x - dot.position.x) / 50;
        let deltaY = (dot.position.y - this.scores.position.y) / 50;
        
        this.addToTicker(() => {
            dot.position.x += deltaX
            dot.position.y -= deltaY;
            distance(dot.position, this.scores.position) < this.scores.width
                ? this.mainContainer.removeChild(dot)
                : null
        }, { interval: 20, callsLimit: 100 })
    }

    protected animationScore(score: number): void {
        this.scores.scale.set(2)
        this.addToTicker(() => {
            this.scores.scale.set(1)
            this.scores.text = `Scores: ${score}`
        }, {interval:200, callsLimit:1})

        
        this.bground.position.x += 20;
        this.addToTicker(()=>{this.bground.position.x -= 20}, {interval:200, callsLimit:1});
    }

    protected endGame(resultText: string) {
        this.titleEnd.text = `The game is over! You ${resultText}! Click here to restart`;
        this.titleEnd.scale.set(1.4)
        this.titleEnd.interactive = true;
        this.titleEnd.on('mousedown', this.gamestart)
        this.scene.removeChild(this.mainContainer);
        this.mainContainer.removeChild(this.enemyBoss);
        this.mainContainer.removeChild(this.pacman);
        this.scene.addChild(this.finishContainer);
        this.dots = [];
        this.enemyBoss.rotation = 0;
        this.pacman.rotation = 0;
        this.vector.x = 0;
        this.vector.y = 0;
        this.isGameStart = !this.isGameStart;
    }

    protected updatePositions(): void {
        const pacman = this.pacman;
        const vector = this.vector;

        pacman.position.x += vector.x * this.speedFactor;
        pacman.position.y += vector.y * this.speedFactor;
        vector.mult(0.98);
        pacman.position.x = (800 + pacman.position.x) % 800;
        pacman.position.y = (500 + pacman.position.y) % 500;

        pacman.rotation = vector.angle();
    }
}