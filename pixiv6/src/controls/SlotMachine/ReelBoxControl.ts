import {Ticker} from "@pixi/ticker";
import {Graphics} from "@pixi/graphics";

import MainControl, {PivotType} from "app/controls/MainControl";
import ReelControl from "app/controls/SlotMachine/ReelControl";
import gameModel from "app/model/GameModel";
import promiseHelper from "app/helpers/promise/ResolvablePromise";
import {promiseDelay} from "app/helpers/TimeHelper";
import gsap from "gsap";

export default class ReelBoxControl extends MainControl {
    public readonly reels: ReelControl[] = [];
    private readonly ticker = new Ticker();
    private readonly mask = new Graphics();

    private reelsCount = 0;

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
        this.reelsCount = gameModel.mainGameInfo.strips.length;

        this.generateReels();
        this.applyMask();
        this.setupHooks();
    }

    public async startSpin() {
        await Promise.all(this.reels.map(async (reel, index) => {
            await promiseDelay(125 * index);
            gsap.to(reel.container, {duration: 0.35, y: -100, ease: "sine.inOut", yoyo: true, repeat: 2});
            await promiseDelay(350);
        }));
    }

    public async stopSpinOn(reelStops: number[]) {
        await this.spinTo(reelStops);
    }

    private async spinTo(reelStops: number[]) {
        this.ticker.start();
        const start = Date.now();
        const resolvablePromise = promiseHelper.getPromiseCounter<void>(this.reels.length);
        this.reels.forEach((reel, index) => {
            gsap.killTweensOf(reel.container);
            reel.container.y = 0;
            const stopIndex = reelStops[index]
            const target = reel.currentPosition + (this.reels.length - reel.currentPosition) + stopIndex;
            const time = this.initialTime + index * this.stopDelay;
            const callback = () => reel.spinTo(start, target, time);
            this.ticker.add(callback);

            reel.onStopSpinning.add(() => {
                this.ticker.remove(callback);
                resolvablePromise.resolve();
            });
        });
        await resolvablePromise;
        this.ticker.stop();
    }

    private setupHooks() {
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
            const reel = new ReelControl(this.reelWidth, i);

            this.add(reel);
            this.reels.push(reel);
        }

        gameModel.reelBoxSize.emit({
            width: this.width,
            height: this.height,
        });

        this.setPivotTo(this.container, PivotType.C);
    }

    private updateMask() {
        const {mask, container} = this;

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
