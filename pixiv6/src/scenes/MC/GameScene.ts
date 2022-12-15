import BackgroundControl from "app/controls/BackgroundControl";
import TextButtonControl from "app/controls/button/TextButtonControl";
import BaseScene from "../BaseScene";
import Resources from "app/pixi/StrictResourcesHelper";
import ChoiceScene from "../ChoiceScene";
import PacmanControl from "app/controls/MC/PacmanControl";
import DotControl from "app/controls/MC/DotControl";
import { Point, Ticker } from "pixi.js";
import { distance, getCollision, Vector } from "app/helpers/math";
import ScoreControl from "app/controls/MC/ScoreControl";
import GhostControl from "app/controls/MC/GhostControler";
import gameModel from "app/model/GameModel";
import WinScreen from "./WinScreen";

export default class GameScene extends BaseScene {
    private readonly pacman = new PacmanControl();
    private readonly dots: DotControl[] = [];
    private readonly score: ScoreControl = new ScoreControl();
    private readonly ghost: GhostControl = new GhostControl();
    private readonly background = new BackgroundControl(
        Resources.getSingleTexture("MC_GAME-BG")
    );

    compose(): void {
        const textButtonControl = new TextButtonControl("Back");
        this.addControl(this.background);
        this.addControl(textButtonControl);
        textButtonControl.container.position.set(50, 100);
        textButtonControl.onClick.add(this.onBackClick, this);
        this.addControl(this.pacman);
        this.addControl(this.score);
        this.addDots();
        this.addControl(this.ghost);
    }

    private addDots() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        for (let i = 100; i < width - 100; i += 100) {
            for (let j = 100; j < height - 100; j += 100) {
                const dot = new DotControl(new Point(i, j));
                this.addControl(dot);
                this.dots.push(dot);
            }
        }
    }

    private checkCollision() {
        this.dots.forEach(async (dot) => {
            if (
                getCollision(
                    dot.position,
                    dot.dotRadius,
                    this.pacman.sprite.position,
                    this.pacman.sprite.width
                )
            ) {
                this.score.increment();
                this.dots.splice(this.dots.indexOf(dot), 1);
                gameModel
                    .getHowler()
                    .play("pop" + (Math.round(Math.random() * 4) + 1));

                this.moveDot(dot);
            }
        });
    }

    private moveDot(dot: DotControl) {
        const ticker = new Ticker();
        const vector = new Vector(
            this.score.position.x - dot.position.x,
            this.score.position.y - dot.position.y
        );
        vector.normalize();
        const speed = 15;

        ticker.add((delta: number) => {
            dot.position.x += vector.x * speed * delta;
            dot.position.y += vector.y * speed * delta;

            if (distance(dot.position, this.score.position) < 10) {
                console.log(dot.position);
                this.scene.removeChild(dot.container);
                ticker.destroy();
            }
        });

        ticker.start();
    }

    private onBackClick() {
        this.sceneManager.navigate(ChoiceScene);
    }

    private checkBorders() {
        const { x, y } = this.pacman.sprite.position;
        if (x > window.innerWidth || x < 0 || y > window.innerHeight || y < 0) {
            this.sceneManager.navigate(ChoiceScene);
        }
    }

    private checkCollisionGhost() {
        if (this.ghost.checkGhostCollision(this.pacman.sprite)) {
            this.sceneManager.navigate(ChoiceScene);
        }
    }

    private checkWin() {
        if (this.score.checkScoresCounter(5)) {
            this.sceneManager.navigate(WinScreen);
        }
    }

    protected onUpdate(delta: number): void {
        super.onUpdate(delta);
        this.pacman.positionUpdate(delta);
        this.checkCollision();
        this.checkBorders();
        this.ghost.update(delta, this.pacman.sprite);
        this.checkCollisionGhost();
        this.checkWin();
    }
}
