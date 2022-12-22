import BaseScene from "app/scenes/BaseScene";
import BackgroundControl from "app/controls/BackgroundControl";
import Resources from "app/pixi/StrictResourcesHelper";
import {SpriteControl} from "app/controls/SpriteControl";

export default class SlotMachineBackgroundScene extends BaseScene {

    private readonly background: BackgroundControl = new BackgroundControl(Resources.getSingleTexture("SLOT-MASHINE_BG"));
    private readonly logo: SpriteControl = new SpriteControl("logo_vertical.png", {x: -1, y: -0.5});

    compose(): void {
        this.addControl(this.background);
        this.addControl(this.logo);
    }

}