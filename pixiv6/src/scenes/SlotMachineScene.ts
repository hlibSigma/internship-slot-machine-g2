import { GameSize } from "app/model/GameModel";

import BaseScene from "app/scenes/BaseScene";
import ReelBoxControl from "app/controls/SlotMachine/ReelBoxControl";
import TextButtonControl from "app/controls/button/TextButtonControl";
import gameModel from "app/model/GameModel";
import ChoiceScene from "app/scenes/ChoiceScene";
import SceneManager from "app/scenes/SceneManager";
import SlotMachineBackgroundScene from "app/scenes/SlotMachineBackgroundScene";
import BetPanelScene from "app/scenes/subscenes/BetPanelScene";
import {TSpinResponse} from "app/server/fruit/service/typing";

export default class SlotMachineScene extends BaseScene {
    private readonly backgroundSceneManager = new SceneManager(this.app, true);
    private readonly reelBox = new ReelBoxControl(1100);
    private readonly textButtonControl = new TextButtonControl("Back");
    private readonly betPanelSceneManager = new SceneManager(this.app, true);
    private spinOutcome: TSpinResponse | undefined;

    async compose() {
        this.backgroundSceneManager.navigate(SlotMachineBackgroundScene);
        this.betPanelSceneManager.navigate(BetPanelScene);
        this.addControl(this.reelBox);
        await gameModel.ready;
        this.textButtonControl.container.position.set(100, 100);
        this.textButtonControl.onClick.add(() => {
            gameModel.getHowler().play("btn_click");
            this.sceneManager.navigate(ChoiceScene);
        }, this);
        const reelSignals = gameModel.game.signals.reels;
        reelSignals.spin.add(this.startSpin, this);
        reelSignals.stop.add(this.stopSpinOn, this);
        gameModel.game.signals.spinComplete.add(this.onSpinComplete, this);
    }

    activate():void {
        super.activate();
        this.addControl(this.textButtonControl);
    }

    dispose() {
        this.betPanelSceneManager.dispose();
        this.backgroundSceneManager.dispose();
        super.dispose();
    }

    protected onResize(gameSize: GameSize) {
         super.onResize(gameSize);
         this.reelBox.container.position.copyFrom(gameSize.centerPosition);
    }

    private async startSpin() {
        await this.reelBox.startSpin();
        gameModel.game.signals.spinStarted.emit();
    }

    private async stopSpinOn(reelStops: number[]) {
        await this.reelBox.stopSpinOn(reelStops);
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
        const reels = this.reelBox.reels;
        await Promise.all(outcome.scatterWins.map(async win => {
            await Promise.all(win.symbols.map(async symbol => {
                await reels[symbol.x].getSymbol(symbol.y).spine.play("win");
            }));
        }));
        await Promise.all(outcome.wins.map(async win => {
            await Promise.all(gameModel.mainGameInfo.lines[win.lineId].map(async (lineOffset, index) => {
                if (index < win.symbolsAmount) {
                    await reels[index].getSymbol(lineOffset).spine.play("win");
                }
            }));
        }));
        reels.forEach(value => value.playForAll("idle"));
        gameModel.game.signals.spinWinPresentationComplete.emit();
    }

}
