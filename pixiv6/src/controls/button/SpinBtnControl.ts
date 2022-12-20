import ButtonControl from "app/controls/button/ButtonControl";
import {Container} from "@pixi/display";
import {SpriteControl} from "app/controls/SpriteControl";

export default class SpinBtnControl extends ButtonControl {

    constructor() {
        super(new Container());
    }

    init() {
        super.init();
        this.add(new SpriteControl("spin_button.png", {x: 0.5, y: 0.5}));
        this.add(new SpriteControl("spin_button_play.png", {x: 0.46, y: 0.5}));
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }
}