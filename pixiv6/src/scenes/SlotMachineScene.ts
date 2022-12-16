import BaseScene from "app/scenes/BaseScene";
import BackgroundControl from "app/controls/BackgroundControl";
import Resources from "app/pixi/StrictResourcesHelper";
import ReelControl from "app/controls/SlotMachine/ReelControl";

export default class SlotMachineScene extends BaseScene {
    private readonly background = new BackgroundControl(Resources.getSingleTexture("SLOT-MASHINE_BG"));
    private readonly reel = new ReelControl(16, 300);

    compose() {
        this.addControl(this.background);
        this.addControl(this.reel);
    }
}
