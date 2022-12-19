import BaseScene from "app/scenes/BaseScene";
import BackgroundControl from "app/controls/BackgroundControl";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";

export default class BackgroundScene extends BaseScene {
    compose(): void {
        this.addControl(new BackgroundControl(StrictResourcesHelper.getSomeTexture("bg.png")));
        // this.addControl(new ReelControl(StrictResourcesHelper.getTexture("ui", "bg")));
    }

}