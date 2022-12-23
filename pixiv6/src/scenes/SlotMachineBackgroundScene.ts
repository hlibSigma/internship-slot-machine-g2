import BaseScene from "app/scenes/BaseScene";
import BackgroundControl from "app/controls/BackgroundControl";
import Resources from "app/pixi/StrictResourcesHelper";
import {SpriteControl} from "app/controls/SpriteControl";
import gameModel, { GameSize, TReelBoxSize } from "app/model/GameModel";

export default class SlotMachineBackgroundScene extends BaseScene {
    private readonly background: BackgroundControl = new BackgroundControl(Resources.getSomeTexture("bg.png"));
    private readonly reelBoxBackground = new SpriteControl("reels.png", {x: 0.5, y: 0.5});
    private readonly logo: SpriteControl = new SpriteControl("logo_vertical.png", {x: -0.5, y: -0.4});

    compose(): void {
        this.addControl(this.background);
        this.addControl(this.reelBoxBackground);
        this.addControl(this.logo);

        gameModel.reelBoxSize.add(this.resizeReelBoxBackground, this);
    }

    protected onResize(gameSize: GameSize) {
        super.onResize(gameSize);
        this.reelBoxBackground.container.position.copyFrom(gameSize.centerPosition);
    }

    private resizeReelBoxBackground({width, height}: TReelBoxSize) {
        const {container} = this.reelBoxBackground;
        const padding = 40;

        container.width = width + padding;
        container.height = height + padding;
    }
}