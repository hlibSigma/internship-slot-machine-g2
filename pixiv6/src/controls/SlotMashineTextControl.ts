import {Container} from "@pixi/display";
import {SpriteControl} from "app/controls/SpriteControl";
import {Text} from "@pixi/text";
import MainControl from "app/controls/MainControl";
import {TBet} from "app/server/fruit/service/typing";
import gameModel from "app/model/GameModel";

export default class SlotMashineTextControl extends MainControl {
    public readonly labelTitle: Text;
    public readonly labelValue: Text;
    private index: number = 0;

    constructor(private title: string, protected bets: TBet[]) {
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
        this.labelValue = new Text(`$ ${this.bets[this.index].value}`, {
            fontFamily: "Neuron-Black",
            fill: "white",
            fontSize: 30,
            fontWeight: "bold",
            letterSpacing: -1,
            lineJoin: "round",
            strokeThickness: 2,
        });
        this.labelValue.pivot.set(this.labelValue.width * .5, this.labelValue.height * .5);
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
        if (this.index != this.bets.length - 1) {
            this.index += 1;
        } else {
            this.index = 0;
        }
        this.updateBet();
    }

    decrement() {
        if (this.index != 0) {
            this.index -= 1;
        } else {
            this.index = this.bets.length - 1;
        }
        this.updateBet();
    }

    private updateBet() {
        const bet = this.bets[this.index];
        this.labelValue.text = `$ ${bet.value}`;
        gameModel.game.signals.betChanged.emit(bet.id);
    }
}