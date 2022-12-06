import BaseScene from "app/scenes/BaseScene";
import {BitmapText} from "@pixi/text-bitmap";
import BackgroundControl from "app/controls/BackgroundControl";
import gameModel, {GameSize} from "app/model/GameModel";
import FullScreenButtonControl from "app/controls/button/FullScreenButtonControl";
import ChoiceScene from "app/scenes/ChoiceScene";
import TextButtonControl from "app/controls/button/TextButtonControl";
import {inject} from "app/model/injection/InjectDecorator";

export default class FontScene extends BaseScene {
    @inject(FullScreenButtonControl)
    public fullScreenButton:FullScreenButtonControl = <any>{};
    private textButtonControl = new TextButtonControl("Back");
    private bitmapText:BitmapText = <any>{};
    private counter:number = 0;

    compose():void {
        this.counter = 0;
        this.bitmapText = new BitmapText("1,2,3,4,5,6,7,8,9,0", {fontName:"sans-serif", fontSize:16});
        this.bitmapText.anchor.set(0.5);
        this.textButtonControl.onClick.add(() => {
            gameModel.getHowler().play("btn_click");
            this.sceneManager.navigate(ChoiceScene);
        }, this);
    }

    activate() {
        super.activate();
        let backgroundControl:BackgroundControl = gameModel.resolve(BackgroundControl);
        this.addControl(backgroundControl);
        this.addControl(this.fullScreenButton);
        this.addControl(this.textButtonControl);
        this.scene.addChild(this.bitmapText);
        this.bitmapText.tint = 0x00ff00;
    }


    protected onResize(gameSize:GameSize) {
        super.onResize(gameSize);
        this.fullScreenButton.container.x = gameSize.width * .9;
        this.fullScreenButton.container.y = gameSize.height * .13;
        this.textButtonControl.container.position.set(
            gameSize.width * .1,
            gameSize.height * .1
        );
        this.bitmapText.position.copyFrom(gameSize.centerPosition);
    }

    protected onUpdate(delta:number) {
        super.onUpdate(delta);
        this.counter += delta;
        this.bitmapText.text = this.counter.toFixed(2) + ""
    }

    dispose() {
        this.textButtonControl.onClick.unload(this);
        super.dispose();
    }

}