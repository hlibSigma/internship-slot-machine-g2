import BaseScene from "app/scenes/BaseScene";
import BackgroundControl from "app/controls/BackgroundControl";
import Resources from "app/pixi/StrictResourcesHelper";
import {SpriteControl} from "app/controls/SpriteControl";

export default class SlotMachineBackgroundScene extends BaseScene {

    private readonly background: BackgroundControl = new BackgroundControl(Resources.getSomeTexture("bg.png"));
    private readonly logo: SpriteControl = new SpriteControl("logo_vertical.png", {x: -0.5, y: -0.4});

    compose(): void {
        this.addControl(this.background);
        this.addControl(this.logo);
    }

}