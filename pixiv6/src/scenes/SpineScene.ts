import BaseScene from "./BaseScene";
import BackgroundControl from "../controls/BackgroundControl";
import gameModel, {GameSize} from "../model/GameModel";
import FullScreenButtonControl from "app/controls/button/FullScreenButtonControl";
import SpineLoader from "app/loader/SpineLoader";
import TextButtonControl from "app/controls/button/TextButtonControl";
import ChoiceScene from "app/scenes/ChoiceScene";
import {Spine} from "@pixi-spine/all-4.0";
import {inject} from "app/model/injection/InjectDecorator";

export default class SpineScene extends BaseScene {
    @inject(FullScreenButtonControl)
    private fullScreenButton:FullScreenButtonControl = <any>{};
    private textButtonControl = new TextButtonControl("Back");
    private spineBoy:Spine = <any>{};

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
        this.scene.addChild(this.spineBoy);
    }

    protected onResize(gameSize:GameSize) {
        super.onResize(gameSize);
        this.spineBoy.x = gameSize.width * .25;
        this.spineBoy.y = (gameSize.height + this.spineBoy.height) * .5;
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

    private getSpineBoy(x:number = 0, y:number = 0):Spine {
        let spineBoy = SpineLoader.getSpine("spineboy");
        let skeleton = spineBoy.skeleton;
        skeleton.setSkinByName("default");
        spineBoy.state.setAnimation(0, "idle", true);
        this.addToTicker(dt => {
            spineBoy.update(((1000 / 60) / 1000) * dt);
        });
        spineBoy.position.set(x, y);
        return spineBoy;
    }
}