import MainControl from "app/controls/MainControl";
import SymbolControl from "app/controls/SlotMachine/SymbolControl";
import Signal from "app/helpers/signals/signal/Signal";
import { backout, interpolate } from "app/helpers/math";

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

        this.generateSymbols();
    }

    public spinTo(start: number, target: number, duration: number) {
        const now = Date.now();
        const phase = Math.min(1, (now - start) / duration);

        this.symbols.forEach((symbol, index) => {
            symbol.spinTo(this.currentPosition + index, this.symbols.length)
        })

        this.currentPosition = interpolate(this.previousPosition, target, backout(0.4, phase));

        if (phase === 1) {
            this.currentPosition = this.previousPosition = target;
            this.onStopSpinning.emit();
        }
    }

    private generateSymbols() {
        for (let i = 0; i < this.symbolsCount; i++) {
            const symbol = new SymbolControl(this.width, i);

            this.add(symbol);
            this.symbols.push(symbol);
        }
    }
}
