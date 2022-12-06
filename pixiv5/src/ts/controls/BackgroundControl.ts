import {Sprite} from "pixi.js";
import MainControl from "./MainControl";
import gameModel, {GameSize} from "../model/GameModel";

export default class BackgroundControl extends MainControl {

    constructor(texture:PIXI.Texture) {
        super();
        this.container.addChild(new Sprite(texture));
        gameModel.updateLayout.add((gameSize:GameSize) => {
           this.container.width = gameSize.width;
           this.container.height = gameSize.height;
        }, this);
    }
}

