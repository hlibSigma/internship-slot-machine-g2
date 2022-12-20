import { GameSize } from "app/model/GameModel";

import BaseScene from "app/scenes/BaseScene";
import BackgroundControl from "app/controls/BackgroundControl";
import Resources from "app/pixi/StrictResourcesHelper";
import ReelBoxControl from "app/controls/SlotMachine/ReelBoxControl";

export default class SlotMachineScene extends BaseScene {
    private readonly background = new BackgroundControl(Resources.getSingleTexture("SLOT-MASHINE_BG"));
    private readonly reelBox = new ReelBoxControl(5, 16, 1500);

    compose() {
        this.addControl(this.background);
        this.addControl(this.reelBox);

        this.reelBox.startSpinning();
    }

    protected onResize(gameSize: GameSize) {
        super.onResize(gameSize);
        this.reelBox.container.position.set(gameSize.width / 2, gameSize.height / 2);
    }
}
