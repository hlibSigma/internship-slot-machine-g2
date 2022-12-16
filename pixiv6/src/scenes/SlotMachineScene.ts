import BaseScene from "app/scenes/BaseScene";
import ReelControl from "app/controls/SlotMachine/ReelControl";

export default class SlotMachineScene extends BaseScene {
    private readonly reel = new ReelControl(16, 300);

    compose() {
        this.addControl(this.reel);
    }
}
