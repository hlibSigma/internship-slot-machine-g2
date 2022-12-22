import { GameSize } from "app/model/GameModel";

import BaseScene from "app/scenes/BaseScene";
import BackgroundControl from "app/controls/BackgroundControl";
import Resources from "app/pixi/StrictResourcesHelper";
import ReelBoxControl from "app/controls/SlotMachine/ReelBoxControl";
import TextButtonControl from "app/controls/button/TextButtonControl";
import gameModel from "app/model/GameModel";
import ChoiceScene from "app/scenes/ChoiceScene";
import SceneManager from "app/scenes/SceneManager";
import SMBackgroundScene from "app/scenes/SMBackgroundScene";
import ReelScene from "app/scenes/subscenes/ReelScene";
import BetPanelScene from "app/scenes/subscenes/BetPanelScene";

export default class SlotMachineScene extends BaseScene {
    private readonly background = new BackgroundControl(Resources.getSingleTexture("SLOT-MASHINE_BG"));
    private readonly reelBox = new ReelBoxControl(5, 16, 1500);
    private textButtonControl = new TextButtonControl("Back");
    private backgroundSceneManager = new SceneManager(this.app, true);
    private reelSceneManager = new SceneManager(this.app, true);
    private betPanelSceneManager = new SceneManager(this.app, true);

    async compose() {
        this.addControl(this.background);
        this.addControl(this.reelBox);
        this.backgroundSceneManager.navigate(SMBackgroundScene);
        this.reelSceneManager.navigate(ReelScene);
        this.betPanelSceneManager.navigate(BetPanelScene);
        await gameModel.ready;
        this.textButtonControl.container.position.set(100, 100);
        this.textButtonControl.onClick.add(() => {
            gameModel.getHowler().play("btn_click");
            this.sceneManager.navigate(ChoiceScene);
        }, this);
    }
    activate():void {
        super.activate();
        this.addControl(this.textButtonControl);

    }

    dispose() {
        this.backgroundSceneManager.dispose();
        this.reelSceneManager.dispose();
        this.betPanelSceneManager.dispose();
        super.dispose();
    }

    protected onResize(gameSize: GameSize) {
        super.onResize(gameSize);
        this.reelBox.container.position.copyFrom(gameSize.centerPosition);
    }
}
