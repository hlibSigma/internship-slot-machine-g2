import { Container } from "@pixi/display";
import { SpriteControl } from "app/controls/SpriteControl";
import ButtonControl from "app/controls/button/ButtonControl";
import { Text } from "@pixi/text";

export default class SlotMashineTextControl extends ButtonControl {
    public readonly labelTitle: Text;
    public readonly labelValue: Text;
    private value: number = 0;
    private arrayValue:Array<number>= [10, 15, 20, 30, 50, 100, 200, 300, 500];
    constructor(private title: string) {
        super(new Container());
        this.labelTitle = new Text(title, {
            fontFamily: "Neuron-Black",
            fill: "white",
            fontSize: 30,
            fontWeight: "bold",
            letterSpacing: -1,
            lineJoin: "round",
            strokeThickness: 2,
        });
        this.labelValue = new Text(`$ ${ this.arrayValue[this.value]}`,{
            fontFamily: "Neuron-Black",
            fill: "white",
            fontSize: 30,
            fontWeight: "bold",
            letterSpacing: -1,
            lineJoin: "round",
            strokeThickness: 2,
        });
        this.labelValue.pivot.set(this.labelValue.width * .5, this.labelValue.height* .5);
        this.container.addChild(this.labelValue);
        this.labelTitle.pivot.set(this.labelTitle.width * .5, this.labelTitle.height * 1.5);
        this.container.addChild(this.labelTitle);
    }

    init() {
        super.init();
        this.add(new SpriteControl("lines_bet_bg.png", {x: 0.5, y: 0.5}));
    }

    dispose() {
        this.container.removeChildren();
        super.dispose();
    }
    increment() {
        if(this.value != this.arrayValue.length -1){
            this.value += 1;
        } else {
            this.value = 0;
        }
        this.labelValue.text = `$ ${ this.arrayValue[this.value]}`;
    }
    decrement() {
        if(this.value != 0){
            this.value -= 1;
        } else {
            this.value = this.arrayValue.length -1;
        }

        this.labelValue.text = `$ ${ this.arrayValue[this.value]}`;
    }
}