import BaseScene from "app/scenes/BaseScene";
import {inject} from "app/model/injection/InjectDecorator";
import FullScreenButtonControl from "app/controls/button/FullScreenButtonControl";
import TextButtonControl from "app/controls/button/TextButtonControl";
// import { Text } from "@pixi/text";
// import {Graphics} from "@pixi/graphics";
import gameModel, {GameSize} from "app/model/GameModel";
import ChoiceScene from "app/scenes/ChoiceScene";
import BackgroundControl from "app/controls/BackgroundControl";
import { SpriteControl } from "app/controls/SpriteControl";
// import SceneManager from "./SceneManager";
// import ReelScene from "./subscenes/ReelScene";
// import BackgroundScene from "./subscenes/BackgroundScene";

export default class MS_PANEL extends BaseScene {

    @inject(FullScreenButtonControl)
    private fullScreenButton:FullScreenButtonControl = <any>{};
    private balance: number = 200;
    private bet: number = 50;
    private currentWidth: number = 0;
    private currentHeight: number = 0;
    private isSpinBlocked: boolean = false;
    private textButtonControl = new TextButtonControl("Back");
    // private spinButtonControl = new TextButtonControl("SPIN", {paddingX: 200, paddingY:100});
    private balanceButtonControl = new TextButtonControl(`BALANCE: ${this.balance}`, {paddingX: 100, paddingY:100});
    private betButtonControl = new TextButtonControl(`BET: ${this.bet}`, {paddingX: 70, paddingY:15});
    // private betUpButtonControl = new TextButtonControl(`+`, {paddingX: 100, paddingY:100});
    // private betDownButtonControl = new TextButtonControl(`-`, {paddingX: 100, paddingY:100});
    private resultButtonControl = new TextButtonControl(`Spin result`, {paddingX: 100, paddingY:100});
    private spinControl = new SpriteControl("spin_button_play.png", {x: 0.5, y: 0.5});
    private plusControl = new SpriteControl("plus.png", {x: 0.5, y: 0.5});
    private minusControl = new SpriteControl("minus.png", {x: 0.5, y: 0.5});

    getRandomInt(max:number):number {
        return Math.floor(Math.random() * max);
    }
    
    compose(): void {
        this.spinControl.container.interactive = true;
        this.spinControl.container.buttonMode = true;
      
        this.plusControl.container.interactive = true;
        this.plusControl.container.buttonMode = true;
        // this.betUpButtonControl.onClick.add(() => {
        this.plusControl.container.addListener("pointerup", () => {
            gameModel.getHowler().play("btn_click");
            this.bet+25 > this.balance ? null : this.bet += 25;
            this.scene.removeChild(this.betButtonControl.container)
            this.betButtonControl = new TextButtonControl(`BET: ${this.bet}`, {paddingX: 70, paddingY:15});
            this.addControl(this.betButtonControl);
            this.betButtonControl.container.position.set(
                this.currentWidth * .4,
                this.currentHeight * .95
            );
        }, this)

        this.minusControl.container.interactive = true;
        this.minusControl.container.buttonMode = true;
        // this.betDownButtonControl.onClick.add(() => {
        this.minusControl.container.addListener("pointerup", () => {
            gameModel.getHowler().play("btn_click");
            this.bet - 25 < 0 ? null : this.bet -= 25;
            this.scene.removeChild(this.betButtonControl.container)
            this.betButtonControl = new TextButtonControl(`BET: ${this.bet}`, {paddingX: 70, paddingY:15});
            this.addControl(this.betButtonControl);
            this.betButtonControl.container.position.set(
                this.currentWidth * .4,
                this.currentHeight * .95
             );
         }, this);
    


        this.textButtonControl.onClick.add(() => {
            gameModel.getHowler().play("btn_click");
            this.sceneManager.navigate(ChoiceScene);
        }, this);


        this.spinControl.container.interactive = true;
        this.spinControl.container.buttonMode = true;
        this.spinControl.container.addListener("pointerup", () => {
        // this.spinButtonControl.onClick.add(() => {
            if (this.balance - this.bet < 0 || this.isSpinBlocked) return;
            gameModel.getHowler().play("btn_click");
            this.isSpinBlocked = true;
            
            if (this.getRandomInt(11) > 5) {
                gameModel.gameSignals.reels.updateAnimation.emit('win')
                gameModel.gameSignals.reels.updateSkin.emit('low1')
                this.balance += this.bet
                this.scene.removeChild(this.resultButtonControl.container)
                this.resultButtonControl = new TextButtonControl(`YOU WIN: +${this.bet}`, {paddingX: 100, paddingY:100});
                this.addControl(this.resultButtonControl);
                this.resultButtonControl.container.position.set(
                    this.currentWidth * .7,
                    this.currentHeight * .95
                );
                this.addToTicker(() => {
                    gameModel.gameSignals.reels.updateAnimation.emit('idle')
                    gameModel.gameSignals.reels.updateSkin.emit('wild')
                    this.isSpinBlocked = false;
                    this.scene.removeChild(this.resultButtonControl.container)
                    this.resultButtonControl = new TextButtonControl(`SPIN RESULT`, {paddingX: 100, paddingY:100});
                    this.addControl(this.resultButtonControl);
                    this.resultButtonControl.container.position.set(
                        this.currentWidth * .7,
                        this.currentHeight * .95
                    );
                }, { interval: 3000, callsLimit: 1 });
            } else {
                gameModel.gameSignals.reels.updateAnimation.emit('undim')
                this.balance -= this.bet
                this.scene.removeChild(this.resultButtonControl.container)
                this.resultButtonControl = new TextButtonControl(`YOU LOSE: -${this.bet}`, {paddingX: 100, paddingY:100});
                this.addControl(this.resultButtonControl);
                this.resultButtonControl.container.position.set(
                    this.currentWidth * .7,
                    this.currentHeight * .95
                );
                this.addToTicker(() => {
                    gameModel.gameSignals.reels.updateAnimation.emit('idle')
                    this.isSpinBlocked = false;
                    this.scene.removeChild(this.resultButtonControl.container)
                    this.resultButtonControl = new TextButtonControl(`SPIN RESULT`, {paddingX: 100, paddingY:100});
                    this.addControl(this.resultButtonControl);
                    this.resultButtonControl.container.position.set(
                        this.currentWidth * .7,
                        this.currentHeight * .95
                    );
                }, { interval: 1000, callsLimit: 1 });
            }

            this.scene.removeChild(this.balanceButtonControl.container)
            this.balanceButtonControl = new TextButtonControl(`BALANCE: ${this.balance}`, {paddingX: 200, paddingY:100});
            this.addControl(this.balanceButtonControl);
            this.balanceButtonControl.container.position.set(
                this.currentWidth * .1,
                this.currentHeight * .95
            );
        }, this);
        
    }

    activate():void {
        super.activate();
        // new SceneManager(this.app, true).navigate(BackgroundScene);
        // new SceneManager(this.app, true).navigate(ReelScene);
        let backgroundControl:BackgroundControl = gameModel.resolve(BackgroundControl);
        // this.addControl(backgroundControl);
        this.addControl(this.fullScreenButton);
        this.addControl(this.textButtonControl);
        // this.addControl(this.spinButtonControl);
        this.addControl(this.balanceButtonControl);
        this.addControl(this.betButtonControl);
        // this.addControl(this.betUpButtonControl);
        // this.addControl(this.betDownButtonControl);
        this.addControl(this.resultButtonControl);
        this.addControl(this.spinControl);
        this.addControl(this.plusControl);
        this.addControl(this.minusControl);

    }

    protected onResize(gameSize:GameSize) {
        super.onResize(gameSize);
        this.currentWidth = gameSize.width;
        this.currentHeight = gameSize.height;
        
        this.spinControl.container.position.set(
            gameSize.width * .9,
            gameSize.height * .95
        )
        this.plusControl.container.position.set(
            gameSize.width * .45,
            gameSize.height * .95
        )
        this.minusControl.container.position.set(
            gameSize.width * .35,
            gameSize.height * .95
        )

        this.fullScreenButton.container.x = gameSize.width * .95;
        this.fullScreenButton.container.y = gameSize.height * .13;
        this.textButtonControl.container.position.set(
            gameSize.width * .1,
            gameSize.height * .1
        );
        this.balanceButtonControl.container.position.set(
            gameSize.width * .1,
            gameSize.height * .95
        );

        this.betButtonControl.container.position.set(
            gameSize.width * .4,
            gameSize.height * .95
        );

        this.resultButtonControl.container.position.set(
            gameSize.width * .7,
            gameSize.height * .95
        );       
    }

}