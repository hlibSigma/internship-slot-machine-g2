import BackgroundControl from "app/controls/BackgroundControl";
import BaseScene from "../BaseScene";
import Resources from "app/pixi/StrictResourcesHelper";
import ChoiceScene from "../ChoiceScene";
import TextButtonControl from "app/controls/button/TextButtonControl";

export default class WinScreen extends BaseScene {
    private readonly background = new BackgroundControl(
        Resources.getSingleTexture("MC_WIN-BG")
    );

    compose(): void {
        this.addControl(this.background);
        const textButtonControl = new TextButtonControl("Back");
        this.addControl(textButtonControl);
        textButtonControl.container.position.set(50, 100);
        textButtonControl.onClick.add(this.onBackClick, this);
    }

    private onBackClick() {
        this.sceneManager.navigate(ChoiceScene);
    }
}
