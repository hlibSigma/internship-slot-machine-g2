import {Container} from "@pixi/display";
import {SpriteControl} from "app/controls/SpriteControl";
import {Text} from "@pixi/text";
import MainControl from "app/controls/MainControl";

export default class SlotMashineWinControl extends MainControl {
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
        this.labelValue.anchor.set(0.5, 0.5);
        this.container.addChild(this.labelTitle);
        this.container.addChild(this.labelValue);
    }

    init() {
        super.init();
        this.add(new SpriteControl("win_bg.png", {x: 0.5, y: 0.5}));
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }

    setBalance(balance: number) {
        this.labelValue.text = balance == 0 ? "" : `$ ${balance.toFixed(2)} `;
    }

}