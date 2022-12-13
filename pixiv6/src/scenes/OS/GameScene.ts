import { Point } from "@pixi/math";

import BaseScene from "app/scenes/BaseScene";
import Resources from "app/pixi/StrictResourcesHelper";
import BackgroundControl from "app/controls/BackgroundControl";

import PacmanControl from "app/controls/OS/PacmanControl";
import DotControl from "app/controls/OS/DotControl";
import ScoreControl from "app/controls/OS/ScoreControl";
import GhostControl from "app/controls/OS/GhostControl";
import ChoiceScene from "app/scenes/ChoiceScene";
import WinScene from "app/scenes/OS/WinScene";
import { GameSize } from "app/model/GameModel";

export default class GameScene extends BaseScene {
    private readonly background = new BackgroundControl(Resources.getSingleTexture("OS_GAME-BG"));
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
        this.sceneManager.navigate(WinScene);
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
