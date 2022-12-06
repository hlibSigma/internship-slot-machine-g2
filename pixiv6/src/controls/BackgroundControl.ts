import MainControl from "./MainControl";
import gameModel, {GameSize} from "../model/GameModel";
import {ScaleHelper} from "app/helpers/ScaleHelper";
import {Texture} from "@pixi/core";
import {Sprite} from "@pixi/sprite";

export default class BackgroundControl extends MainControl {

    constructor(texture:Texture) {
        super();
        let sprite = new Sprite(texture);
        sprite.anchor.set(0.5, 0.5);
        this.container.addChild(sprite);
        gameModel.updateLayout.add((gameSize:GameSize, resolve?:()=>void) => {
            ScaleHelper.scaleToSize(this.container, gameSize);
            this.container.position.set(
                gameSize.width * 0.5,
                gameSize.height * 0.5
            );
            resolve!();
        }, this);
    }
}

