import MainControl from "app/controls/MainControl";
import SymbolControl from "app/controls/SlotMachine/SymbolControl";

export default class ReelControl extends MainControl {
    private readonly symbols: SymbolControl[];
    private readonly width: number;
    private readonly height: number;

    constructor(symbolsCount: number, width: number) {
        super();

        this.symbols = new Array<SymbolControl>(symbolsCount);

        this.width = width;
        this.height = width * symbolsCount;

        this.generateReel();
    }

    private generateReel() {
        for (let i = 0; i < this.symbols.length; i++) {
            const symbol = new SymbolControl(this.width, this.width * i, this.height);

            this.symbols[i] = symbol;
            this.add(symbol);
        }
    }
}
