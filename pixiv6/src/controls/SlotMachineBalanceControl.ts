import { Container } from "@pixi/display";
import { SpriteControl } from "app/controls/SpriteControl";
import ButtonControl from "app/controls/button/ButtonControl";

export default class SlotMashineBalanceControl extends ButtonControl {

    constructor() {
        super(new Container());
    }

    init() {
        super.init();
        this.add(new SpriteControl("balance_bg.png", {x: 0.5, y: 0.5}));
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }

}