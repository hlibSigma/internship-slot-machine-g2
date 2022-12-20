import BaseScene from "app/scenes/BaseScene";
import {inject} from "app/model/injection/InjectDecorator";
import FullScreenButtonControl from "app/controls/button/FullScreenButtonControl";
import TextButtonControl from "app/controls/button/TextButtonControl";
import gameModel, {GameSize} from "app/model/GameModel";
import ChoiceScene from "app/scenes/ChoiceScene";
import SceneManager from "app/scenes/SceneManager";
import BackgroundScene from "app/scenes/subscenes/BackgroundScene";
import ReelScene from "app/scenes/subscenes/ReelScene";
import BetPanelScene from "app/scenes/subscenes/BetPanelScene";

export default class SymbolsScene extends BaseScene {

    @inject(FullScreenButtonControl)
    private fullScreenButton:FullScreenButtonControl = <any>{};
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


    async compose() {
        new SceneManager(this.app, true).navigate(BackgroundScene);
        new SceneManager(this.app, true).navigate(ReelScene);
        new SceneManager(this.app, true).navigate(BetPanelScene);
        await gameModel.ready;
        this.textButtonControl.onClick.add(() => {
            gameModel.getHowler().play("btn_click");
            this.sceneManager.navigate(ChoiceScene);
        }, this);
        this.nextSkinButtonControl.onClick.add(() => {
            this.skinIndex++;
            this.skinIndex = this.skinIndex % this.skins.length
            gameModel.getHowler().play("btn_click");
            gameModel.game.signals.reels.updateSkin.emit(this.skins[this.skinIndex]);
        }, this);
        this.nextAnimationButtonControl.onClick.add(() => {
            this.animationIndex++;
            this.animationIndex = this.animationIndex % this.animations.length
            gameModel.getHowler().play("btn_click");
            gameModel.game.signals.reels.updateAnimation.emit(this.animations[this.animationIndex]);

        }, this);

    }

    activate():void {
        super.activate();
        this.addControl(this.fullScreenButton);
        this.addControl(this.textButtonControl);
        this.addControl(this.nextSkinButtonControl);
        this.addControl(this.nextAnimationButtonControl);
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
    }

}