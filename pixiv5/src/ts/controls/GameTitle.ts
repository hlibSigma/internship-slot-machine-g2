import PIXI from "pixi.js";
import gameModel from "../model/GameModel";
import TextStyles from "../model/TextStyles";
import MainControl from "./MainControl";

export default class GameTitle extends MainControl{
    public readonly gameTitle:PIXI.Text;

    constructor(private title:string) {
        super();
        this.gameTitle = new PIXI.Text(title, TextStyles.GAME_LABEL);
        this.container.addChild(this.gameTitle);
        this.gameTitle.pivot.set(this.gameTitle.width * .5, this.gameTitle.height * .5);
        window.addEventListener("beforeunload", ev => {
            gameModel.unload(this);
        });
    }
}