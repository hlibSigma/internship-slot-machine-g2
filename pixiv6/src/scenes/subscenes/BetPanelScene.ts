import BaseScene from "app/scenes/BaseScene";
import SpinBtnControl from "app/controls/button/SpinBtnControl";
import LayoutManager, {PartialLayout} from "app/layoutManager/LayoutManager";
import {inject} from "app/model/injection/InjectDecorator";
import gameModel from "app/model/GameModel";
import {promiseDelay} from "app/helpers/TimeHelper";

const layout: PartialLayout = {
    name: "body",
    width: "80%",
    height: "20%",
    top: "80%",
    left: "10%",
    layouts: [
        {
            name: "spin_btn",
            height: "90%",
            scaleBy: "height",
            top: "45%",
            align: "c",
        }
    ]
}
export default class BetPanelScene extends BaseScene {
    @inject(LayoutManager)
    private layoutManager: LayoutManager = <any>{};
    private betId: number = 1;
    private spinBtnControl: SpinBtnControl = new SpinBtnControl();

    async compose() {
        const spinBtnControl = this.spinBtnControl;
        this.addControl(spinBtnControl.name("spin_btn"));
        spinBtnControl.disable();
        await gameModel.ready;
        spinBtnControl.enable();
        spinBtnControl.onClick.add(this.onSpinRequest, this);
        gameModel.game.signals.spinComplete.add(this.onSpinComplete, this);
        gameModel.game.signals.betChanged.add(this.onBetChanged, this);
    }

    activate() {
        super.activate();
        this.layoutManager.addLayout(layout);
    }

    deactivate() {
        this.layoutManager.removeLayout(layout)
        super.dispose();
    }

    private onSpinComplete() {
        this.spinBtnControl.enable();
    }

    private async onBetChanged(betId: number) {
        this.betId = betId;
    }

    private async onSpinRequest() {
        this.spinBtnControl.disable();
        gameModel.game.signals.reels.spin.emit();
        const tSpinResponse = await gameModel.game.fruit.serverCommunicator.spin(this.betId);
        await promiseDelay(500);
        gameModel.game.signals.reels.stop.emit(tSpinResponse.userStats.reelStops);
    }
}