import BaseScene from "app/scenes/BaseScene";
import BackgroundControl from "app/controls/BackgroundControl";
import Resources from "app/pixi/StrictResourcesHelper";
import ChoiceScene from "app/scenes/ChoiceScene";
import TextButtonControl from "app/controls/button/TextButtonControl";
import { GameSize } from "app/model/GameModel";

export default class OS_WinScene extends BaseScene {
    private readonly background = new BackgroundControl(Resources.getSingleTexture("OS_WIN-BG"));
    private readonly backBtn = new TextButtonControl("Back");
    compose() {
        this.addControl(this.background);
        this.addControl(this.backBtn);
    }

    activate() {
        super.activate();

        this.backBtn.onClick.add(this.onBackBtnClick, this);
    }

    protected onResize(gameSize: GameSize) {
        super.onResize(gameSize);

        this.backBtn.container.position.set(
            gameSize.width / 2,
            gameSize.height - 100
        );
    }

    private onBackBtnClick() {
        this.sceneManager.navigate(ChoiceScene);
    }
}
