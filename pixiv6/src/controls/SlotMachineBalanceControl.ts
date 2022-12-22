import { Container } from "@pixi/display";
import { SpriteControl } from "app/controls/SpriteControl";
import ButtonControl from "app/controls/button/ButtonControl";
import { Text } from "@pixi/text";

export default class SlotMashineBalanceControl extends ButtonControl {
    public readonly labelTitle:Text;
    constructor(private title:string) {
        super(new Container());
        this.labelTitle = new Text(title,{
            fontFamily: "Neuron-Black",
            fill: "white",
            fontSize: 30,
            fontWeight: "bold",
            letterSpacing: -1,
            lineJoin: "round",
            strokeThickness: 2,
        });
        this.labelTitle.pivot.set(this.labelTitle.width * .5, this.labelTitle.height* 1.5);
        this.container.addChild(this.labelTitle);
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