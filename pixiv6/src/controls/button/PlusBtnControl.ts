import ButtonControl from "app/controls/button/ButtonControl";
import {Container} from "@pixi/display";
import {SpriteControl} from "app/controls/SpriteControl";

export default class PlusBtnControl extends ButtonControl {

    constructor() {
        super(new Container());
    }

    init() {
        super.init();
        this.add(new SpriteControl("plus.png", {x: 0, y: 0.5}));
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }
}