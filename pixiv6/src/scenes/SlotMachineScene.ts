import { GameSize } from "app/model/GameModel";

import BaseScene from "app/scenes/BaseScene";
import ReelBoxControl from "app/controls/SlotMachine/ReelBoxControl";
import TextButtonControl from "app/controls/button/TextButtonControl";
import gameModel from "app/model/GameModel";
import ChoiceScene from "app/scenes/ChoiceScene";
import SceneManager from "app/scenes/SceneManager";
import SlotMachineBackgroundScene from "app/scenes/SlotMachineBackgroundScene";
import BetPanelScene from "app/scenes/subscenes/BetPanelScene";

export default class SlotMachineScene extends BaseScene {
    private readonly backgroundSceneManager = new SceneManager(this.app, true);
    private readonly reelBox = new ReelBoxControl(1500);
    private readonly textButtonControl = new TextButtonControl("Back");
    private readonly betPanelSceneManager = new SceneManager(this.app, true);

    async compose() {
        this.backgroundSceneManager.navigate(SlotMachineBackgroundScene);
        this.betPanelSceneManager.navigate(BetPanelScene);
        this.addControl(this.reelBox);
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
        this.betPanelSceneManager.dispose();
        this.backgroundSceneManager.dispose();
        super.dispose();
    }

    protected onResize(gameSize: GameSize) {
        super.onResize(gameSize);
        this.reelBox.container.position.copyFrom(gameSize.centerPosition);
    }
}
