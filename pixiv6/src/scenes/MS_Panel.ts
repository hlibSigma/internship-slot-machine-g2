import BaseScene from "app/scenes/BaseScene";
import {inject} from "app/model/injection/InjectDecorator";
import FullScreenButtonControl from "app/controls/button/FullScreenButtonControl";
import TextButtonControl from "app/controls/button/TextButtonControl";
import gameModel, {GameSize} from "app/model/GameModel";
import ChoiceScene from "app/scenes/ChoiceScene";
// import BackgroundControl from "app/controls/BackgroundControl";
import { SpriteControl } from "app/controls/SpriteControl";
import MSTextControl from "app/controls/MS/MSTextControl";



export default class MS_PANEL extends BaseScene {

    @inject(FullScreenButtonControl)
    private fullScreenButton:FullScreenButtonControl = <any>{};
    private balance: number = 200;
    private bet: number = 50;
    private currentWidth: number = 0;
    private currentHeight: number = 0;
    private isSpinBlocked: boolean = false;
    private textButtonControl = new TextButtonControl("Back");
    private balanceControl = new MSTextControl("Balance", this.balance);
    private betControl = new MSTextControl("Bet", this.bet);
    private spinControl = new SpriteControl("spin_button_play.png", {x: 0.5, y: 0.5});
    private plusControl = new SpriteControl("plus.png", {x: 0.5, y: 0.5});
    private minusControl = new SpriteControl("minus.png", { x: 0.5, y: 0.5 });
    private balanceBorderControl = new SpriteControl("balance_bg.png", { x: 0.5, y: 0.5 });
    private betBorderControl = new SpriteControl("total_bet_bg.png", { x: 0.5, y: 0.5 });
    

    getRandomInt(max:number):number {
        return Math.floor(Math.random() * max);
    }
    
    compose(): void {
        this.spinControl.container.interactive = true;
        this.spinControl.container.buttonMode = true;
      
        this.plusControl.container.interactive = true;
        this.plusControl.container.buttonMode = true;
        this.plusControl.container.addListener("pointerup", () => {
            gameModel.getHowler().play("btn_click");
            if (this.bet + 25 <= this.balance) {
                this.bet += 25;
                this.betControl.increment(25);
            }
        }, this)

        this.minusControl.container.interactive = true;
        this.minusControl.container.buttonMode = true;
        this.minusControl.container.addListener("pointerup", () => {
            gameModel.getHowler().play("btn_click");
            if (this.bet - 25 >= 0) {
                this.bet -= 25;
                this.betControl.increment(-25);
            }         
         }, this);
    
        this.textButtonControl.onClick.add(() => {
            gameModel.getHowler().play("btn_click");
            this.sceneManager.navigate(ChoiceScene);
        }, this);


        this.spinControl.container.interactive = true;
        this.spinControl.container.buttonMode = true;
        this.spinControl.container.addListener("pointerup", () => {
            if (this.balance - this.bet < 0 || this.isSpinBlocked) return;
            gameModel.getHowler().play("btn_click");
            this.isSpinBlocked = true;
            
            if (this.getRandomInt(11) > 5) {
                gameModel.gameSignals.reels.updateAnimation.emit('win')
                gameModel.gameSignals.reels.updateSkin.emit('low1')
                this.balance += this.bet
                this.balanceControl.increment(this.bet);
                this.addToTicker(() => {
                    gameModel.gameSignals.reels.updateAnimation.emit('idle')
                    gameModel.gameSignals.reels.updateSkin.emit('wild')
                    this.isSpinBlocked = false;
                }, { interval: 30, callsLimit: 1 });
            } else {
                gameModel.gameSignals.reels.updateAnimation.emit('undim')
                this.balance -= this.bet
                this.balanceControl.increment(-this.bet);
                this.addToTicker(() => {
                    gameModel.gameSignals.reels.updateAnimation.emit('idle')
                    this.isSpinBlocked = false;
                }, { interval: 10, callsLimit: 1 });
            }
        }, this);
        


    }

    activate():void {
        super.activate();
        this.addControl(this.fullScreenButton);
        this.addControl(this.textButtonControl);
        this.addControl(this.spinControl);
        this.addControl(this.balanceBorderControl);
        this.addControl(this.betBorderControl);
        this.addControl(this.balanceControl);
        this.addControl(this.betControl);
        
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
            gameSize.width * .44,
            gameSize.height * .95
        )
        this.minusControl.container.position.set(
            gameSize.width * .36,
            gameSize.height * .95
        )
        this.balanceBorderControl.container.position.set(
            gameSize.width * .1,
            gameSize.height * .95
        )
        this.betBorderControl.container.position.set(
            gameSize.width * .4,
            gameSize.height * .95
        )
        this.fullScreenButton.container.x = gameSize.width * .95;
        this.fullScreenButton.container.y = gameSize.height * .13;
        this.textButtonControl.container.position.set(
            gameSize.width * .1,
            gameSize.height * .1
        );     
        this.balanceControl.container.position.set(
            gameSize.width * .1,
            gameSize.height * .95
        );  
        this.betControl.container.position.set(
            gameSize.width * .4,
            gameSize.height * .95
        );       
    }

}