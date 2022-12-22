import MainControl from "app/controls/MainControl";
import SymbolControl from "app/controls/SlotMachine/SymbolControl";
import Signal from "app/helpers/signals/signal/Signal";
import { backout, interpolate } from "app/helpers/math";
import gameModel from "app/model/GameModel";

export default class ReelControl extends MainControl {
    public readonly onStopSpinning = new Signal<void>();

    public currentPosition = 0;
    private previousPosition = 0;

    private readonly symbols: SymbolControl[] = [];

    constructor(
        private readonly width: number,
        private readonly reelIndex = 0,
    ) {
        super();

        this.container.x = width / 2 + width * reelIndex;

        this.generateSymbols();
    }

    public spinTo(start: number, target: number, duration: number) {
        const now = Date.now();
        const phase = Math.min(1, (now - start) / duration);

        this.symbols.forEach((symbol, index) => {
            symbol.spinTo(this.currentPosition + index, this.symbols.length);
        });

        this.currentPosition = interpolate(this.previousPosition, target, backout(0.4, phase));

        if (phase === 1) {
            this.onStopSpinning.emit();
        }
    }

    private createSymbol(index: number, skin: string) {
        const symbol = new SymbolControl(skin, this.width, index);

        this.add(symbol);
        this.symbols.push(symbol);
    }

    private generateSymbols() {
        const { strips, symbols } = gameModel.mainGameInfo;
        const symbolIds = strips[this.reelIndex];

        for (let i = 0; i < symbolIds.length; i++) {
            const symbolId = symbolIds[i];
            const symbolData = symbols.find(value => value.id == symbolId);

            if (!symbolData) {
                throw `No symbol data for symbol with ${symbolId} id!`;
            }

            this.createSymbol(i, symbolData.name.toLowerCase());
        }
    }
}
