import BaseScene from "app/scenes/BaseScene";
import BackgroundControl from "app/controls/BackgroundControl";
import Resources from "app/pixi/StrictResourcesHelper";
import ReelControl from "app/controls/SlotMachine/ReelControl";
import { Ticker } from "@pixi/ticker";

export default class SlotMachineScene extends BaseScene {
    private readonly background = new BackgroundControl(Resources.getSingleTexture("SLOT-MASHINE_BG"));
    private readonly reel = new ReelControl(16, 300);

    compose() {
        this.addControl(this.background);
        this.addControl(this.reel);

        const ticker = new Ticker();
        const start = Date.now();
        const target = this.reel.currentPosition + 10;

        ticker.add(() => this.reel.spinTo(start, target, 2000));
        ticker.start();
    }
}
