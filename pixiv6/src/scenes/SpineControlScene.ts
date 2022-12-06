import BaseScene from "./BaseScene";
import BackgroundControl from "../controls/BackgroundControl";
import gameModel, {GameSize} from "../model/GameModel";
import FullScreenButtonControl from "app/controls/button/FullScreenButtonControl";
import TextButtonControl from "app/controls/button/TextButtonControl";
import ChoiceScene from "app/scenes/ChoiceScene";
import {inject} from "app/model/injection/InjectDecorator";
import SpineControl from "app/controls/SpineControl";

export default class SpineControlScene extends BaseScene {
    @inject(FullScreenButtonControl)
    private fullScreenButton:FullScreenButtonControl = <any>{};
    private textButtonControl = new TextButtonControl("Back");
    private spineBoy:SpineControl = <any>{};

    compose():void {
        this.spineBoy = this.getSpineBoy();
        this.textButtonControl.onClick.add(() => {
            gameModel.getHowler().play("btn_click");
            this.sceneManager.navigate(ChoiceScene);
        }, this);
    }

    activate():void {
        super.activate();
        let backgroundControl:BackgroundControl = gameModel.resolve(BackgroundControl);
        this.addControl(backgroundControl);
        this.addControl(this.fullScreenButton);
        this.addControl(this.textButtonControl);
        this.addControl(this.spineBoy);
        this.spineBoy.play("idle", {loop:true});
        this.spineBoy.setSkin("default");
    }

    protected onResize(gameSize:GameSize) {
        super.onResize(gameSize);
        this.spineBoy.container.x = gameSize.width * .25;
        this.spineBoy.container.y = (gameSize.height + this.spineBoy.container.height) * .5;
        this.fullScreenButton.container.x = gameSize.width * .9;
        this.fullScreenButton.container.y = gameSize.height * .13;
        this.textButtonControl.container.position.set(
            gameSize.width * .1,
            gameSize.height * .1
        );
    }

    deactivate() {
        super.deactivate();
    }

    dispose() {
        this.textButtonControl.onClick.unload(this);
        super.dispose();
    }

    private getSpineBoy():SpineControl {
        const spineControl = new SpineControl("spineboy");
        return spineControl;
    }
}