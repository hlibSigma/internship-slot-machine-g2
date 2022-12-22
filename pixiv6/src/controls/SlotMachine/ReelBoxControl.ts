import { Ticker } from "@pixi/ticker";
import { Graphics } from "@pixi/graphics";

import MainControl, { PivotType } from "app/controls/MainControl";
import ReelControl from "app/controls/SlotMachine/ReelControl";
import gameModel from "app/model/GameModel";

export default class ReelBoxControl extends MainControl {
    public isSpinning = false;

    private readonly reels: ReelControl[] = [];
    private readonly ticker = new Ticker();
    private readonly mask = new Graphics();

    private reelsCount = 0;
    private symbolsPerReel = 0;

    private get reelWidth() {
        return this.width / this.reelsCount;
    }

    private get height() {
        return this.reelWidth * 3;
    }

    constructor(
        private width: number,
        private initialTime = 1000,
        private stopDelay = 300,
    ) {
        super();
    }

    async init() {
        super.init();

        await gameModel.ready;
        const reelsInfo = gameModel.mainGameInfo.reels;

        this.reelsCount = reelsInfo.amount;
        this.symbolsPerReel = reelsInfo.height;

        this.generateReels();
        this.applyMask();
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
                this.updateMask();
            }, this);
        }
    }

    private clearReels() {
        for (const reel of this.reels) {
            this.container.removeChild(reel.container);
        }

        this.reels.length = 0;
    }

    private generateReels() {
        this.clearReels();

        for (let i = 0; i < this.reelsCount; i++) {
            const reel = new ReelControl(this.symbolsPerReel, this.reelWidth, i);

            this.add(reel);
            this.reels.push(reel);
        }

        this.setPivotTo(this.container, PivotType.C);
    }

    private updateMask() {
        const { mask, container } = this;

        mask.clear();
        mask.drawRect(
            0,
            (container.height - this.height) / 2,
            container.width,
            this.height,
        );
    }

    private applyMask() {
        this.updateMask();

        this.container.mask = this.mask;
        this.container.addChild(this.mask);
    }
}
