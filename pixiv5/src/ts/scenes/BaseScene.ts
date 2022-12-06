import {Container} from "pixi.js";
import {SceneManager} from "./SceneManager";
import gameModel, {GameSize} from "../model/GameModel";

export default abstract class BaseScene {

    readonly scene:Container = new Container();

    protected constructor(protected sceneManager:SceneManager, protected app:PIXI.Application) {
        gameModel.updateLayout.add(this.onResize, this);
    }

    abstract compose():void;

    abstract dispose():void;

    protected onResize(gameSize:GameSize) {

    }
}