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
        private readonly symbolsCount: number,
        private readonly width: number,
        private readonly offsetX = 0,
    ) {
        super();

        this.container.x = width / 2 + width * offsetX;
        this.container.y = symbolsCount % 2 === 0 ? 0 : width / 2;

        this.generateSymbols(0);
    }

    public async spinTo(start: number, target: number, duration: number) {
        const now = Date.now();
        const phase = Math.min(1, (now - start) / duration);

        this.symbols.forEach((symbol, index) => {
            symbol.spinTo(this.currentPosition + index, this.symbolsCount);
        });

        this.currentPosition = interpolate(this.previousPosition, target, backout(0.4, phase));

        if (phase === 1) {
            this.currentPosition = this.previousPosition = target;
            this.onStopSpinning.emit();

            this.generateSymbols(target % this.symbolsCount);
        }
    }

    private setSymbolSkin(index: number, skin: string) {
        let symbol = this.symbols[index];

        if (symbol) {
            symbol.spine.setSkin(skin);
        }
        else {
            symbol = new SymbolControl(skin, this.width, index);

            this.add(symbol);
            this.symbols.push(symbol);
        }
    }

    private generateSymbols(stopIndex: number) {
        const strips = gameModel.mainGameInfo.strips[this.offsetX];
        const symbols = strips.concat(strips).slice(stopIndex, stopIndex + this.symbolsCount);

        for (let i = 0; i < this.symbolsCount; i++) {
            const symbolId = symbols[i];
            const symbolData = gameModel.mainGameInfo.symbols.find(value => value.id == symbolId);

            if (!symbolData) {
                throw `No symbol data for symbol with ${symbolId} id!`;
            }

            this.setSymbolSkin(i, symbolData.name.toLowerCase());
        }
    }
}
