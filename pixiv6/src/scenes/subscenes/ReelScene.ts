import BaseScene from "app/scenes/BaseScene";
import {SpriteControl} from "app/controls/SpriteControl";
import ReelControl from "app/controls/ReelControl";
import gameModel, {GameSize} from "app/model/GameModel";

export default class ReelScene extends BaseScene {
    private readonly reels: ReelControl[] = [];

    private reelBgControl = new SpriteControl("reels.png", {x: 0.5, y: 0.5});

    compose(): void {
        this.addControl(this.reelBgControl);
        let mainGameInfo = gameModel.mainGameInfo;
        let reels = mainGameInfo.reels;
        let bg = this.reelBgControl.container;
        let reelHeight = bg.height;
        let reelWidth = bg.width;
        for (let i = 0; i < reels.amount; i++) {
            let reelControl = new ReelControl(mainGameInfo.strips);
            reelControl.name(`reel_${i}`);
            this.reels.push(reelControl);
            this.reelBgControl.add(reelControl);
            reelControl.container.position.x = i * 270 - reelWidth * 0.5 + 165;
            reelControl.container.position.y = -reelHeight * 0.5 + 75;
        }
        gameModel.gameSignals.reels.updateSkin.add(this.onUpdateSkins, this);
        gameModel.gameSignals.reels.updateAnimation.add(this.onUpdateAnimations, this);
    }

    protected onResize(gameSize: GameSize) {
        super.onResize(gameSize);
        this.reelBgControl.container.position.copyFrom(gameSize.centerPosition);
        /*this.reels.forEach((value, index) => {
            value.container.position.x = index * 200;
            value.container.position.y = gameSize.centerPosition.y - value.container.height * .5;
        });*/
    }

    private onUpdateSkins(skin:string) {
        this.reels.forEach(value => {
            value.updateSkins(skin);
        })
    }

    private onUpdateAnimations(animation:string) {
        this.reels.forEach(value => {
            value.updateAnimations(animation);
        })
    }
}