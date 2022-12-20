import BaseScene from "app/scenes/BaseScene";
import BackgroundControl from "app/controls/BackgroundControl";
import Resources from "app/pixi/StrictResourcesHelper";

export default class SlotMachineScene extends BaseScene {
    private readonly background = new BackgroundControl(Resources.getSingleTexture("SLOT-MASHINE_BG"));
    compose() {
        this.addControl(this.background);
    }
}
