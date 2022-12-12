import { Point } from "@pixi/math";

import BaseScene from "app/scenes/BaseScene";
import Resources from "app/pixi/StrictResourcesHelper";
import BackgroundControl from "app/controls/BackgroundControl";

import OS_PacmanControl from "app/controls/OS/OS_PacmanControl";
import OS_DotControl from "app/controls/OS/OS_DotControl";
import OS_ScoreControl from "app/controls/OS/OS_ScoreControl";
import OS_GhostControl from "app/controls/OS/OS_GhostControl";
import ChoiceScene from "app/scenes/ChoiceScene";
import OS_WinScene from "app/scenes/OS_WinScene";
import { GameSize } from "app/model/GameModel";

export default class OS_GameScene extends BaseScene {
    private readonly background = new BackgroundControl(Resources.getSingleTexture("OS_GAME-BG"));
    private readonly pacman = new OS_PacmanControl();
    private readonly dots: OS_DotControl[] = [];
    private readonly score = new OS_ScoreControl();
    private readonly ghost = new OS_GhostControl(this.pacman);
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

        this.dots.forEach(dot => dot.animate(delta));
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
        this.sceneManager.navigate(OS_WinScene);
    }

    private lose() {
        this.sceneManager.navigate(ChoiceScene);
    }

    private generateDots() {
        const maxPos = {
            x: window.innerWidth - this.padding,
            y: window.innerHeight - this.padding,
        };

        for (let x = this.padding; x < maxPos.x; x += this.padding) {
            for (let y = this.padding; y < maxPos.y; y += this.padding) {
                const dot = new OS_DotControl(new Point(x, y));

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
                // this.scenes.game.background.shake();

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
