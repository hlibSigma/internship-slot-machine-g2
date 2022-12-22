import BaseScene from "app/scenes/BaseScene";
import SpinBtnControl from "app/controls/button/SpinBtnControl";
import LayoutManager, { PartialLayout } from "app/layoutManager/LayoutManager";
import { inject } from "app/model/injection/InjectDecorator";
import gameModel, { GameSize } from "app/model/GameModel";
import { promiseDelay } from "app/helpers/TimeHelper";
import PlusBtnControl from "app/controls/button/PlusBtnControl";
import MinusBtnControl from "app/controls/button/MinusBtnControl";
import SlotMashineTextControl from "app/controls/SlotMashineTextControl";
import SlotMashineBalanceControl from "app/controls/SlotMachineBalanceControl";


const layout: PartialLayout = {
    name: "body",
    width: "70%",
    height: "20%",
    top: "70%",
    left: "20%",
    layouts: [
        {
            name: "minus_btn",
            height: "40%",
            scaleBy: "height",
            top: "90%",
            align: "l",
        },
        {
            name: "bet_label",
            height: "40%",
            scaleBy: "height",
            top: "90%",
            align: "l",
        },
        {
            name: "plus_btn",
            height: "40%",
            scaleBy: "height",
            top: "90%",
            align: "l",
        },
        {
            name: "balance_label",
            height: "40%",
            scaleBy: "height",
            top: "90%",
            align: "r",
        },
        {
            name: "spin_btn",
            height: "90%",
            scaleBy: "height",
            top: "90%",
            align: "r",
        },


    ]
}
export default class BetPanelScene extends BaseScene {
    @inject(LayoutManager)
    private layoutManager: LayoutManager = <any>{};
    private betId: number = 1;
    private spinBtnControl: SpinBtnControl = new SpinBtnControl();
    private plusBtnControl: PlusBtnControl = new PlusBtnControl();
    private minusBtnControl: MinusBtnControl = new MinusBtnControl();
    private betControl = new SlotMashineTextControl("BET");
    private BalanceLabelControl: SlotMashineBalanceControl = new SlotMashineBalanceControl("BALANCE");


    async compose() {
        const spinBtnControl = this.spinBtnControl;
        const plusBtnControl = this.plusBtnControl;
        const minusBtnControl = this.minusBtnControl;
        const betControl = this.betControl;
        const BalanceLabelControl = this.BalanceLabelControl;
        this.addControl(spinBtnControl.name("spin_btn"));
        this.addControl(plusBtnControl.name("plus_btn"));
        this.addControl(minusBtnControl.name("minus_btn"));
        this.addControl(betControl.name("bet_label"));
        this.addControl(BalanceLabelControl.name("balance_label"));
        spinBtnControl.disable();
        await gameModel.ready;
        spinBtnControl.enable();
        spinBtnControl.onClick.add(() => {
            this.onSpinRequest;
            gameModel.getHowler().play("spin-button");
        }, this);
        plusBtnControl.onClick.add(() => {
            gameModel.getHowler().play("custom-button");
        }, this);
        minusBtnControl.onClick.add(() => {
            gameModel.getHowler().play("custom-button");
        }, this);
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