import { Ticker } from "@pixi/ticker";

import MainControl, { PivotType } from "app/controls/MainControl";
import ReelControl from "app/controls/SlotMachine/ReelControl";
import gameModel from "app/model/GameModel";

export default class ReelBoxControl extends MainControl {
    public isSpinning = false;

    private readonly reels: ReelControl[] = [];
    private readonly ticker = new Ticker();

    constructor(
        private reelsCount: number,
        private symbolsPerReel: number,
        private width: number,
        private initialTime = 1000,
        private stopDelay = 300,
    ) {
        super();

        this.generateReels();
        this.setupHooks();

        this.ticker.start();
    }

    public startSpinning() {
        if (this.isSpinning) {
            return;
        }

        const start = Date.now();
        this.isSpinning = true;

        this.reels.forEach((reel, index) => {
            const target = reel.currentPosition + 10;
            const time = this.initialTime + index * this.stopDelay;

            const callback = () => reel.spinTo(start, target, time);

            this.ticker.add(callback);

            reel.onStopSpinning.add(() => {
                this.ticker.remove(callback)

                if (index === this.reels.length - 1) {
                    this.isSpinning = false;
                }
            });
        });
    }

    private setupHooks() {
        gameModel.startSpinning.add(this.startSpinning, this);

        for (const hook of gameModel.reelBoxOnChangeHooks) {
            hook.signal.add((value: any) => {
                this[hook.propName as keyof this] = value;
                this.generateReels();
            }, this);
        }
    }

    private clearReels() {
        this.container.removeChildren();
        this.reels.length = 0;
    }

    private generateReels() {
        this.clearReels();

        for (let i = 0; i < this.reelsCount; i++) {
            const reel = new ReelControl(this.symbolsPerReel, this.width / this.reelsCount, i);

            this.add(reel);
            this.reels.push(reel);
        }

        this.setPivotTo(this.container, PivotType.C);
    }
}
