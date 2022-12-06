import BaseScene from "./BaseScene";
import BackgroundControl from "../controls/BackgroundControl";
import gameModel, {GameSize} from "../model/GameModel";
import {Sprite} from "@pixi/sprite";
import StrictResourcesHelper from "./../pixi/StrictResourcesHelper";
import FullScreenButtonControl from "app/controls/button/FullScreenButtonControl";
import TextButtonControl from "app/controls/button/TextButtonControl";
import ChoiceScene from "app/scenes/ChoiceScene";
import {promiseDelay} from "app/helpers/TimeHelper";
import {inject} from "app/model/injection/InjectDecorator";

export default class DevAnimationScene extends BaseScene {
    @inject(FullScreenButtonControl)
    public fullScreenButton:FullScreenButtonControl = <any>{};
    private textButtonControl = new TextButtonControl("Back");
    private sprite:Sprite = new Sprite();

    compose():void {
        let texture = StrictResourcesHelper.getTexture("UI", "alf-like.png");
        this.sprite = new Sprite(texture);
        this.sprite.pivot.set(this.sprite.width * .5, this.sprite.height * .5);
        this.textButtonControl.onClick.add(() => {
            gameModel.getHowler().play("btn_click");
            this.sceneManager.navigate(ChoiceScene);
        }, this);
    }

    activate():void {
        super.activate();
        let loopSoundId = gameModel.getHowler().play("relax_loop");
        gameModel.getHowler().volume(0, loopSoundId);
        gameModel.getHowler().fade(0, 1, 1000, loopSoundId);
        this.addToDeactivateList(async () => {
            let duration = 500;
            gameModel.getHowler().fade(1, 0, duration, loopSoundId);
            await promiseDelay(duration*.5);
            gameModel.getHowler().stop(loopSoundId);
        });
        let backgroundControl:BackgroundControl = gameModel.resolve(BackgroundControl);
        this.addControl(backgroundControl);
        this.addControl(this.fullScreenButton);
        this.addControl(this.textButtonControl);
        let x = 0;
        this.addToTicker(dt => {
            this.sprite.scale.set(Math.sin(x) / 2 + 1, Math.cos(x) / 2 + 1);
            x += 0.1 * dt;
        });
        this.scene.addChild(
            this.sprite,
        );
    }

    protected onResize(gameSize:GameSize) {
        super.onResize(gameSize);
        this.sprite.x = gameSize.width * .5;
        this.sprite.y = gameSize.height * .5;
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

}