import { Container } from "@pixi/display";
import { SpriteControl } from "app/controls/SpriteControl";
import ButtonControl from "app/controls/button/ButtonControl";
import { Text } from "@pixi/text";

export default class SlotMashineTotalBetControl extends ButtonControl {
    public readonly labelTitle:Text;
    public readonly labelValue: Text;
    private value: number = 1000;

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
        this.labelValue = new Text(`$ ${ this.value}`,{
            fontFamily: "Neuron-Black",
            fill: "white",
            fontSize: 30,
            fontWeight: "bold",
            letterSpacing: -1,
            lineJoin: "round",
            strokeThickness: 2,
        });
        this.labelTitle.pivot.set(this.labelTitle.width * .5, this.labelTitle.height* 1.5);
        this.labelValue.pivot.set(this.labelValue.width * .5, this.labelValue.height* .5);
        this.container.addChild(this.labelTitle);
        this.container.addChild(this.labelValue);
    }

    init() {
        super.init();
        this.add(new SpriteControl("total_bet_bg.png", {x: 0.5, y: 0.5}));
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }

}