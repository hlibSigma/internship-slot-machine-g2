import BaseScene from "app/scenes/BaseScene";
import BackgroundControl from "app/controls/BackgroundControl";
import Resources from "app/pixi/StrictResourcesHelper";
import { SpriteControl } from "app/controls/SpriteControl";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";

export default class SlotMachineBackgroundScene extends BaseScene {
    private background = new BackgroundControl(Resources.getSingleTexture("SLOT-MASHINE_BG"));
    private logo: any;
    compose(): void {
        this.logo =  new SpriteControl("logo_vertical.png",{x:-1,y:-0.5});
        this.addControl(this.background);
        this.addControl(this.logo);
    }

}