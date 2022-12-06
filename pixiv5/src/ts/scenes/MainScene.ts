import BaseScene from "./BaseScene";
import BackgroundControl from "../controls/BackgroundControl";
import gameModel, {GameSize} from "../model/GameModel";
import {Sprite} from "pixi.js";
import StrictResourcesHelper from "../pixi/StrictResourcesHelper";
import FullScreenButtonControl from "../controls/FullScreenButtonControl";
import AlphaFadeInEffect from "../pixi/effects/AlphaFadeInEffect";

export default class MainScene extends BaseScene {

    compose():void {
        // @ts-ignore
        let backgroundControl:BackgroundControl = gameModel.controls.get(BackgroundControl);
        let fullScreenButton = new FullScreenButtonControl(document.body, 0xffffff);
        let texture = StrictResourcesHelper.getTexture("UI", "alf-like.png");
        this.scene.addChild(backgroundControl.container);
        this.scene.addChild(fullScreenButton.container);
        let sprite = new Sprite(texture);
        sprite.pivot.set(sprite.width * .5, sprite.height * .5)
        this.scene.addChild(sprite);
        let x = 0;
        this.app.ticker.add(params => {
            sprite.scale.set(Math.sin(x)/2 + 1, Math.cos(x)/2 + 1);
            x += 0.1;
        });
        new AlphaFadeInEffect(backgroundControl.container, this.app.ticker);
        gameModel.updateLayout.add((gameSize:GameSize) => {
            sprite.x = gameSize.width * .5;
            sprite.y = gameSize.height * .5;
            fullScreenButton.container.x = gameSize.width * .785;
            fullScreenButton.container.y = gameSize.height * .13;
        }, this);
    }

    dispose():void {
        gameModel.unload(this);
    }

}