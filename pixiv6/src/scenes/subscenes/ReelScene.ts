import BaseScene from "app/scenes/BaseScene";
import {SpriteControl} from "app/controls/SpriteControl";
import ReelControl from "app/controls/ReelControl";
import gameModel, {GameSize} from "app/model/GameModel";
import {promiseDelay} from "app/helpers/TimeHelper";
import {TSpinResponse} from "app/server/fruit/service/typing";

export default class ReelScene extends BaseScene {
    private readonly reels: ReelControl[] = [];

    private reelBgControl = new SpriteControl("reels.png", {x: 0.5, y: 0.5});
    private spinOutcome: TSpinResponse | undefined;

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
        gameModel.game.signals.spinComplete.add(this.onSpinComplete, this);
        gameModel.game.signals.data.spin.add(this.onSpinResponse, this);
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

    private async onStop(reelStops: number[]) {
        await Promise.all(this.reels.map(async (reel, index) => {
            await promiseDelay((0.1 * index) * 1000);
            await reel.stop(reelStops[index]);
        }));
        gameModel.game.signals.spinComplete.emit();
    }

    private async onSpinComplete() {
        const outcome = this.spinOutcome;
        if (!outcome) {
            return;
        }
        if (outcome.wins.length + outcome.scatterWins.length == 0) {
            return;
        }
        await Promise.all(outcome.scatterWins.map(async win => {
            await Promise.all(win.symbols.map(async symbol => {
                await this.reels[symbol.x].getSymbol(symbol.y).play("win");
            }));
        }));
        await Promise.all(outcome.wins.map(async win => {
            await Promise.all(gameModel.mainGameInfo.lines[win.lineId].map(async (lineOffset, index) => {
                if (index < win.symbolsAmount) {
                    await this.reels[index].getSymbol(lineOffset).play("win", {loop:true});
                }
            }));
        }));
        gameModel.game.signals.spinWinPresentationComplete.emit();
    }

    private onSpinResponse(outcome: TSpinResponse) {
        this.spinOutcome = outcome;
    }
}