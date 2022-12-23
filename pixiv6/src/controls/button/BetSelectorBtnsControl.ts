import {Container} from "@pixi/display";
import PlusBtnControl from "app/controls/button/PlusBtnControl";
import SlotMashineTextControl from "app/controls/SlotMashineTextControl";
import MinusBtnControl from "app/controls/button/MinusBtnControl";
import MainControl from "app/controls/MainControl";
import gameModel from "app/model/GameModel";

export default class BetSelectorBtnsControl extends MainControl {

    constructor() {
        super(new Container());
    }

    init() {
        super.init();
        const plusBtnControl = new PlusBtnControl();
        const betControl = new SlotMashineTextControl("BET", gameModel.mainGameInfo.bets);
        const minusBtnControl = new MinusBtnControl();
        this.add(plusBtnControl);
        this.add(betControl);
        this.add(minusBtnControl);
        minusBtnControl.container.position.x = -betControl.container.width / 2;
        plusBtnControl.container.position.x = betControl.container.width / 2;
        plusBtnControl.onClick.add(() => {
            gameModel.getHowler().play("custom-button");
            betControl.increment();
        }, this);
        minusBtnControl.onClick.add(() => {
            gameModel.getHowler().play("custom-button");
            betControl.decrement();
        }, this);
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }
}