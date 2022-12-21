import BaseScene from "app/scenes/BaseScene";
import BackgroundControl from "app/controls/BackgroundControl";
import Resources from "app/pixi/StrictResourcesHelper";
import ChoiceScene from "app/scenes/ChoiceScene";
import TextButtonControl from "app/controls/button/TextButtonControl";
import { GameSize } from "app/model/GameModel";
import GameScene from "app/scenes/OS/GameScene";

export default class FinalScene extends BaseScene {
    public static background = new BackgroundControl();

    private readonly buttonOptions = {
        paddingX: 60,
        paddingY: 50,
        style: {
            fontFamily: "PressStart2P"
        }
    };

    private readonly buttons = [
        new TextButtonControl("Restart", this.buttonOptions),
        new TextButtonControl("Back to menu", this.buttonOptions),
    ];

    compose() {
        this.addControl(FinalScene.background);

        for (const button of this.buttons) {
            this.addControl(button);
        }
    }

    activate() {
        super.activate();

        this.buttons[0].onClick.add(this.onRestartBtnClick, this);
        this.buttons[1].onClick.add(this.onBackBtnClick, this);
    }

    static setBackgroundTexture(textureId: string) {
        FinalScene.background.sprite.texture = Resources.getSingleTexture(textureId);
    }

    protected onResize(gameSize: GameSize) {
        super.onResize(gameSize);
        this.updateButtonLayout(gameSize);
    }

    private updateButtonLayout(gameSize: GameSize, gap = 25, margin = 100) {
        for (let i = 0; i < this.buttons.length; i++) {
            const { container } = this.buttons[i];

            container.position.set(
                gameSize.width / 2,
                gameSize.height - ((container.height + gap) * i) - margin,
            );
        }
    }

    private onRestartBtnClick() {
        this.sceneManager.navigate(GameScene);
    }

    private onBackBtnClick() {
        this.sceneManager.navigate(ChoiceScene);
    }
}
