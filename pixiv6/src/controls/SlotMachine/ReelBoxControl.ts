import MainControl, { PivotType } from "app/controls/MainControl";
import ReelControl from "app/controls/SlotMachine/ReelControl";

export default class ReelBoxControl extends MainControl {
    private readonly reels: ReelControl[];

    constructor(reelsCount: number, reelLength: number, width: number) {
        super();

        this.reels = new Array<ReelControl>(reelsCount);

        this.generateReels(reelLength, width / reelsCount);
        this.setPivotTo(this.container, PivotType.L);
    }

    get isSpinning() {
        return this.reels[this.reels.length - 1].isSpinning;
    }

    startSpinning = (delay = 1000) => {
        for (let i = 0; i < this.reels.length; i++) {
            setTimeout(this.reels[i].startSpinning, i * delay);
        }
    }

    stopSpinning = (delay = 1000) => {
        for (let i = 0; i < this.reels.length; i++) {
            setTimeout(this.reels[i].stopSpinning, i * delay);
        }
    }

    private generateReels(reelLength: number, reelWidth: number) {
        for (let i = 0; i < this.reels.length; i++) {
            const reel = new ReelControl(reelLength, reelWidth);

            reel.container.position.x = reelWidth * i;

            this.reels[i] = reel;
            this.add(reel);
        }
    }
}
