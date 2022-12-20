import MainControl from "app/controls/MainControl";
import SymbolControl from "app/controls/SlotMachine/SymbolControl";

export default class ReelControl extends MainControl {
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

    private generateSymbols() {
        for (let i = 0; i < this.symbolsCount; i++) {
            const symbol = new SymbolControl(this.width, i);

            this.add(symbol);
            this.symbols.push(symbol);
        }
    }
}
