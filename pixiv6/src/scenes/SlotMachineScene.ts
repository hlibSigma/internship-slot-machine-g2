import BaseScene from "app/scenes/BaseScene";
import ReelControl from "app/controls/SlotMachine/ReelControl";
import BackgroundControl from "app/controls/BackgroundControl";
import Resources from "app/pixi/StrictResourcesHelper";

export default class SlotMachineScene extends BaseScene {
    private readonly reel = new ReelControl(16, 300);
    private readonly background = new BackgroundControl(Resources.getSingleTexture("SLOT-MASHINE_BG"));

    compose() {
        this.addControl(this.reel);
        this.addControl(this.background);
    }
}
