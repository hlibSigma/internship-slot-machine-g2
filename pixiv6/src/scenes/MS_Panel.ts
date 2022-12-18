import BaseScene from "app/scenes/BaseScene";
import {inject} from "app/model/injection/InjectDecorator";
import FullScreenButtonControl from "app/controls/button/FullScreenButtonControl";
import TextButtonControl from "app/controls/button/TextButtonControl";
import gameModel, {GameSize} from "app/model/GameModel";
import ChoiceScene from "app/scenes/ChoiceScene";
import BackgroundControl from "app/controls/BackgroundControl";

export default class MS_PANEL extends BaseScene {

    @inject(FullScreenButtonControl)
    private fullScreenButton:FullScreenButtonControl = <any>{};
    private balance: number = 999;
    private bet: number = 50;
    private currentWidth: number = 0;
    private currentHeight: number = 0;

    private textButtonControl = new TextButtonControl("Back");
    private spinButtonControl = new TextButtonControl("SPIN", {paddingX: 200, paddingY:100});
    private balanceButtonControl = new TextButtonControl(`BALANCE: ${this.balance}`, {paddingX: 200, paddingY:100});
    private betButtonControl = new TextButtonControl(`BET: ${this.bet}`, {paddingX: 100, paddingY:100});
    private betUpButtonControl = new TextButtonControl(`+`, {paddingX: 100, paddingY:100});
    private betDownButtonControl = new TextButtonControl(`-`, {paddingX: 100, paddingY:100});
    
    getRandomInt(max:number):number {
        return Math.floor(Math.random() * max);
    }
    
    compose():void {
        
        this.textButtonControl.onClick.add(() => {
            console.log('first')
            gameModel.getHowler().play("btn_click");
            this.sceneManager.navigate(ChoiceScene);
        }, this);

        this.betUpButtonControl.onClick.add(() => {
            console.log('222')
            gameModel.getHowler().play("btn_click");
            this.bet+25 >= this.balance ? null : this.bet += 25;
            this.scene.removeChild(this.betButtonControl.container)
            this.betButtonControl = new TextButtonControl(`BET: ${this.bet}`, {paddingX: 100, paddingY:100});
            this.addControl(this.betButtonControl);
            this.betButtonControl.container.position.set(
                this.currentWidth * .5,
                this.currentHeight * .9
            );
        });
        this.spinButtonControl.onClick.add(() => {
             gameModel.getHowler().play("btn_click");
             console.log(this.getRandomInt(10))
            this.getRandomInt(10) > 5
                 ? this.balance += this.bet
                 : this.balance -= this.bet
            this.scene.removeChild(this.balanceButtonControl.container)
            this.balanceButtonControl = new TextButtonControl(`BALANCE: ${this.balance}`, {paddingX: 200, paddingY:100});
            this.addControl(this.balanceButtonControl);
            this.balanceButtonControl.container.position.set(
                this.currentWidth * .2,
                this.currentHeight * .9
             );
                 }, this);
        this.betDownButtonControl.onClick.add(() => {
            gameModel.getHowler().play("btn_click");
            this.bet - 25 < 0 ? null : this.bet -= 25;
            this.scene.removeChild(this.betButtonControl.container)
            this.betButtonControl = new TextButtonControl(`BET: ${this.bet}`, {paddingX: 100, paddingY:100});
            this.addControl(this.betButtonControl);
            this.betButtonControl.container.position.set(
                this.currentWidth * .5,
                this.currentHeight * .9
             );
         }, this);

    }

    activate():void {
        super.activate();
        let backgroundControl:BackgroundControl = gameModel.resolve(BackgroundControl);
        this.addControl(backgroundControl);
        this.addControl(this.fullScreenButton);
        this.addControl(this.textButtonControl);
        this.addControl(this.spinButtonControl);
        this.addControl(this.balanceButtonControl);
        this.addControl(this.betButtonControl);
        this.addControl(this.betUpButtonControl);
        this.addControl(this.betDownButtonControl);
        
    }

    protected onResize(gameSize:GameSize) {
        super.onResize(gameSize);
        this.currentWidth = gameSize.width;
        this.currentHeight = gameSize.height;

        this.fullScreenButton.container.x = gameSize.width * .9;
        this.fullScreenButton.container.y = gameSize.height * .13;
        this.textButtonControl.container.position.set(
            gameSize.width * .1,
            gameSize.height * .1
        );
        this.spinButtonControl.container.position.set(
            gameSize.width * .8,
            gameSize.height * .9
        );
        this.balanceButtonControl.container.position.set(
            gameSize.width * .2,
            gameSize.height * .9
        );

        this.betButtonControl.container.position.set(
            gameSize.width * .5,
            gameSize.height * .9
        );
        this.betUpButtonControl.container.position.set(
            gameSize.width * .4,
            gameSize.height * .9
        );
        this.betDownButtonControl.container.position.set(
            gameSize.width * .6,
            gameSize.height * .9
        );
        
    }

}