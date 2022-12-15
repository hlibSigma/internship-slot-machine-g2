import BaseScene from "app/scenes/BaseScene";
import {inject} from "app/model/injection/InjectDecorator";
import FullScreenButtonControl from "app/controls/button/FullScreenButtonControl";
import SpineControl from "app/controls/SpineControl";
import TextButtonControl from "app/controls/button/TextButtonControl";
import gameModel, {GameSize} from "app/model/GameModel";
import ChoiceScene from "app/scenes/ChoiceScene";
import BackgroundControl from "app/controls/BackgroundControl";

export default class SymbolsScene extends BaseScene {

    @inject(FullScreenButtonControl)
    private fullScreenButton:FullScreenButtonControl = <any>{};
    private spineSymbols:SpineControl[] = [];
    private textButtonControl = new TextButtonControl("Back");
    private nextSkinButtonControl = new TextButtonControl("Skin");
    private nextAnimationButtonControl = new TextButtonControl("Animation");
    private skinIndex = 0;
    private readonly skins = [
        "wild",
        "scatter",
        "low1",
        "low2",
        "low3",
        "high1",
        "high2",
        "high3",
    ];
    private animationIndex = 0;
    private readonly animations = [
        "idle",
        "win",
        "land",
        "dim",
        "undim",
    ];


    compose():void {
        for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) {
            this.spineSymbols.push(
                this.getSpineSymbol(i * 100, j * 100)
            )
        }
        this.textButtonControl.onClick.add(() => {
            gameModel.getHowler().play("btn_click");
            this.sceneManager.navigate(ChoiceScene);
        }, this);
        this.nextSkinButtonControl.onClick.add(() => {
            this.skinIndex++;
            this.skinIndex = this.skinIndex % this.skins.length
            gameModel.getHowler().play("btn_click");
            this.spineSymbols.forEach(value => {
                value.setSkin(this.skins[this.skinIndex])
            });
        }, this);
        this.nextAnimationButtonControl.onClick.add(() => {
            this.animationIndex++;
            this.animationIndex = this.animationIndex % this.animations.length
            gameModel.getHowler().play("btn_click");
            this.spineSymbols.forEach(value => {
                value.play(this.animations[this.animationIndex], {loop: true})
            });
        }, this);

    }

    activate():void {
        super.activate();
        let backgroundControl:BackgroundControl = gameModel.resolve(BackgroundControl);
        this.addControl(backgroundControl);
        this.addControl(this.fullScreenButton);
        this.addControl(this.textButtonControl);
        this.addControl(this.nextSkinButtonControl);
        this.addControl(this.nextAnimationButtonControl);
        this.spineSymbols.forEach(value => {
            this.addControl(value);
            value.setSkin(this.skins[this.skinIndex])
            value.play(this.animations[this.animationIndex], {loop: true})
        });
    }

    protected onResize(gameSize:GameSize) {
        super.onResize(gameSize);
        this.fullScreenButton.container.x = gameSize.width * .9;
        this.fullScreenButton.container.y = gameSize.height * .13;
        this.textButtonControl.container.position.set(
            gameSize.width * .1,
            gameSize.height * .1
        );
        this.nextAnimationButtonControl.container.position.set(
            gameSize.width * .2,
            gameSize.height * .1
        );
        this.nextSkinButtonControl.container.position.set(
            gameSize.width * .3,
            gameSize.height * .1
        );
        for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) {
            let symbolWidth = 200;
            let symbolHeight = 200;
            this.spineSymbols[j * 5 + i].container.position.set(
                i * symbolWidth + gameSize.width * .5 - symbolWidth * 5 / 2 + symbolWidth / 2,
                j * symbolHeight + gameSize.height * .3
            )
        }
    }

    protected getSpineSymbol(x:number = 0, y:number = 0):SpineControl {
        let spineControl = new SpineControl("symbols");
        spineControl.container.position.set(x, y);
        return spineControl;
    }


}