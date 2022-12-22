import BaseScene from "app/scenes/BaseScene";
import {SpriteControl} from "app/controls/SpriteControl";
import ReelControl from "app/controls/ReelControl";
import gameModel, {GameSize} from "app/model/GameModel";
import {promiseDelay} from "app/helpers/TimeHelper";

export default class ReelScene extends BaseScene {
    private readonly reels: ReelControl[] = [];

    private reelBgControl = new SpriteControl("reels.png", {x: 0.5, y: 0.5});

    async compose() {
        await gameModel.ready;
        this.addControl(this.reelBgControl);
        let mainGameInfo = gameModel.mainGameInfo;
        let reels = mainGameInfo.reels;
        let bg = this.reelBgControl.container;
        let reelHeight = bg.height;
        let reelWidth = bg.width;
        for (let i = 0; i < reels.amount; i++) {
            let reelControl = new ReelControl(i, mainGameInfo.strips[i]);
            reelControl.name(`reel_${i}`);
            this.reels.push(reelControl);
            this.reelBgControl.add(reelControl);
            reelControl.container.position.x = i * 270 - reelWidth * 0.5 + 165;
            reelControl.container.position.y = -reelHeight * 0.5 + 75;
        }
        gameModel.game.signals.reels.updateSkin.add(this.onUpdateSkins, this);
        gameModel.game.signals.reels.updateAnimation.add(this.onUpdateAnimations, this);
        gameModel.game.signals.reels.spin.add(this.onSpin, this);
        gameModel.game.signals.reels.stop.add(this.onStop, this);
    }

    protected onResize(gameSize: GameSize) {
        super.onResize(gameSize);
        this.reelBgControl.container.position.copyFrom(gameSize.centerPosition);
    }

    private onUpdateSkins(skin: string) {
        this.reels.forEach(value => {
            value.updateSkins(skin);
        })
    }

    private onUpdateAnimations(animation: string) {
        this.reels.forEach(value => {
            value.updateAnimations(animation);
        })
    }

    private async onSpin() {
        await Promise.all(this.reels.map(async (reel, index) => {
            await promiseDelay((0.1 * index) * 1000);
            await reel.spin();
        }));
        gameModel.game.signals.spinStarted.emit();
    }

    private async onStop(reelStops:number[]) {
        await Promise.all(this.reels.map(async (reel, index) => {
            await promiseDelay((0.1 * index) * 1000);
            await reel.stop(reelStops[index]);
        }));
        gameModel.game.signals.spinComplete.emit();
    }
}