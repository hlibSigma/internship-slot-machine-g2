import { Point } from "@pixi/math";

import BaseScene from "app/scenes/BaseScene";
import Resources from "app/pixi/StrictResourcesHelper";
import BackgroundControl from "app/controls/BackgroundControl";

import PacmanControl from "app/controls/OS/PacmanControl";
import DotControl from "app/controls/OS/DotControl";
import ScoreControl from "app/controls/OS/ScoreControl";
import GhostControl from "app/controls/OS/GhostControl";
import FinalScene from "app/scenes/OS/FinalScene";
import { GameSize } from "app/model/GameModel";
import { gameSize } from "app/Main";

export default class GameScene extends BaseScene {
    private readonly background = new BackgroundControl(Resources.getSingleTexture("OS_GAME-BG"), 100);
    private readonly pacman = new PacmanControl();
    private readonly dots: DotControl[] = [];
    private readonly score = new ScoreControl();
    private readonly ghost = new GhostControl(this.pacman);
    private readonly padding = 100;

    compose() {
        this.addControl(this.background);
        this.addControl(this.pacman);
        this.addControl(this.score);
        this.addControl(this.ghost);

        this.generateDots();
    }

    protected onUpdate(delta: number) {
        super.onUpdate(delta);

        this.pacman.update(delta);

        this.ghost.update(delta);
        this.checkGhostCollision();

        this.checkDotsCollision();
    }

    protected onResize(gameSize: GameSize) {
        super.onResize(gameSize);

        this.score.container.position.set(
            gameSize.width / 2,
            this.padding / 2
        );
    }

    private win() {
        FinalScene.setBackgroundTexture("OS_WIN-BG");
        this.sceneManager.navigate(FinalScene);
    }

    private lose() {
        FinalScene.setBackgroundTexture("OS_LOSE-BG");
        this.sceneManager.navigate(FinalScene);
    }

    private generateDots() {
        const maxPos = {
            x: gameSize.width - this.padding,
            y: gameSize.height - this.padding,
        };

        for (let x = this.padding; x <= maxPos.x; x += this.padding) {
            for (let y = this.padding; y <= maxPos.y; y += this.padding) {
                const dot = new DotControl(new Point(x, y));

                this.dots.push(dot);
                this.addControl(dot);
            }
        }
    }

    private checkDotsCollision() {
        for (const dot of this.dots) {
            if (dot.checkCollision(this.pacman.sprite)) {
                this.pacman.grow();

                this.score.increment();
                this.background.shake();

                this.scene.removeChild(dot.container);
                this.dots.splice(this.dots.indexOf(dot), 1);

                if (this.dots.length === 0) {
                    this.win();
                }
            }
        }
    }

    private checkGhostCollision() {
        if (this.ghost.checkCollision()) {
            this.lose();
        }
    }
}
