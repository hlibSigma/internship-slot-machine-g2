import BaseScene from "app/scenes/BaseScene";
import SpinBtnControl from "app/controls/button/SpinBtnControl";
import LayoutManager, {PartialLayout} from "app/layoutManager/LayoutManager";
import {inject} from "app/model/injection/InjectDecorator";
import gameModel, {GameSize} from "app/model/GameModel";
import {promiseDelay} from "app/helpers/TimeHelper";
import SlotMashineBalanceControl from "app/controls/SlotMachineBalanceControl";
import SlotMashineTotalBetControl from "app/controls/SlotMachineTotalBetControl";
import SlotMashineWinControl from "app/controls/SlotMachineWinControl";
import BetSelectorBtnsControl from "app/controls/button/BetSelectorBtnsControl";
import {TSpinResponse} from "app/server/fruit/service/typing";


const layout: PartialLayout = {
    name: "body",
    width: "90%",
    height: "10%",
    top: "90%",
    left: "5%",
    sortBy: "horizontal",
    layouts: [
        {
            name: "balance_label_con",
            width: "100%",
            height: "100%",
            layouts: [{
                name: "balance_label",
                width: "100%",
                height: "75%",
                top: "50%",
                left: "50%",
            }]
        }, {
            name: "bet-selector-con",
            width: "100%",
            height: "100%",
            layouts: [{
                name: "bet-selector",
                width: "100%",
                height: "75%",
                top: "50%",
                left: "50%",
            }]
        }, {
            name: "win_label_con",
            width: "100%",
            height: "100%",
            layouts: [{
                name: "win_label",
                width: "100%",
                height: "75%",
                top: "50%",
                left: "50%",
            }]
        }, {
            name: "total-win",
            width: "100%",
            height: "100%",
        }, {
            name: "total-win",
            width: "20%",
            height: "100%",
        },
    ]
}
export default class BetPanelScene extends BaseScene {
    @inject(LayoutManager)
    private layoutManager: LayoutManager = <any>{};
    private betId: number = 1;
    private betSelector: BetSelectorBtnsControl = new BetSelectorBtnsControl();
    private spinBtnControl: SpinBtnControl = new SpinBtnControl();
    private balanceLabelControl: SlotMashineBalanceControl = new SlotMashineBalanceControl("BALANCE");
    private totalBetControl: SlotMashineTotalBetControl = new SlotMashineTotalBetControl("TOTAL BET");
    private winControl: SlotMashineWinControl = new SlotMashineWinControl("WIN");
    private spinResponse: TSpinResponse | undefined;


    async compose() {
        const betSelector = this.betSelector;
        const spinBtnControl = this.spinBtnControl;
        const balanceLabelControl = this.balanceLabelControl;
        const totalBetControl = this.totalBetControl;
        const winControl = this.winControl;
        this.addControl(betSelector.name("bet-selector"));
        this.addControl(spinBtnControl.name("spin_btn"));
        this.addControl(balanceLabelControl.name("balance_label"));
        this.addControl(totalBetControl.name("total-bet_label"));
        this.addControl(winControl.name("win_label"));
        spinBtnControl.disable();
        await gameModel.ready;
        const userStats = gameModel.mainGameInfo.userStats;
        balanceLabelControl.setBalance(userStats.balance);
        winControl.setBalance(0);
        spinBtnControl.enable();
        spinBtnControl.onClick.add(this.onSpinBtnClick, this);
        gameModel.game.signals.spinStarted.add(this.onSpinStarted, this);
        gameModel.startSpinning.add(this.onSpinBtnClick, this);
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

    private onSpinBtnClick() {
        this.onSpinRequest();
        gameModel.getHowler().play("spin-button");
    }

    private onSpinStarted() {
        if (this.spinResponse) {
            const balance = this.spinResponse.userStats.balance - this.spinResponse.totalWin;
            this.balanceLabelControl.setBalance(balance)
            this.winControl.setBalance(0);
        }
    }

    private onSpinComplete() {
        this.spinBtnControl.enable();
        if (this.spinResponse) {
            const userStats = this.spinResponse.userStats;
            const balance = userStats.balance;
            this.balanceLabelControl.setBalance(balance)
            this.winControl.setBalance(this.spinResponse.totalWin);
            if(this.spinResponse.totalWin>0){
                gameModel.getHowler().play("success");
            }
        }
    }

    private async onBetChanged(betId: number) {
        this.betId = betId;
    }

    private async onSpinRequest() {
        gameModel.getHowler().play("reel-spin")
        this.spinBtnControl.disable();
        gameModel.game.signals.reels.spin.emit();
        this.spinResponse = await gameModel.game.fruit.serverCommunicator.spin(this.betId);
        await promiseDelay(500);
        gameModel.game.signals.reels.stop.emit(this.spinResponse.userStats.reelStops);
    }

    protected onResize(gameSize: GameSize) {
        super.onResize(gameSize);
        this.spinBtnControl.container.position.set(
            gameSize.width * .87,
            gameSize.height * .9
        )
    }
}