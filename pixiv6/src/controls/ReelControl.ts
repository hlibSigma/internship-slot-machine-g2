import MainControl from "app/controls/MainControl";
import {Container} from "@pixi/display";
import gameModel from "app/model/GameModel";
import SpineControl from "app/controls/SpineControl";

export default class ReelControl extends MainControl {

    private readonly symbols: SpineControl[] = [];

    constructor(
        protected readonly reelIndex: number,
        protected readonly strips: number[]
    ) {
        super(new Container());
    }

    init() {
        super.init();
        let mainGameInfo = gameModel.mainGameInfo;
        let reels = mainGameInfo.reels;
        for (let i = 0; i < reels.height; i++) {
            // let spriteControl = new SpriteControl("symbols/apple", {x:0.5, y:0.5});
            let spriteControl = this.getSpineSymbol(0, 240 * i + 100);
            this.add(spriteControl);
            spriteControl.container.position.y = 240 * i + 100;
            this.symbols.push(spriteControl);
        }
        this.stop(mainGameInfo.userStats.reelStops[this.reelIndex]);
    }

    protected getSpineSymbol(x: number = 0, y: number = 0): SpineControl {
        let spineControl = new SpineControl("symbols");
        spineControl.container.position.set(x, y);
        return spineControl;
    }

    updateSkins(skin: string) {
        this.symbols.forEach(value => value.setSkin(skin));
    }

    updateAnimations(animation: string) {
        this.symbols.forEach(value => value.play(animation, {trackIndex: 1, loop: true}));
    }

    async spin() {
        await Promise.all(this.symbols.map(async symbol => {
            await symbol.play("dim", {loop: true, loopsLimit: 4});
        }));
    }

    async stop(stopIndex: number) {
        const symbols = this.strips.concat(this.strips).slice(stopIndex, stopIndex + 3);
        await Promise.all(this.symbols.map(async (symbol, index) => {
            const symbolId = symbols[index];
            const symbolData = gameModel.mainGameInfo.symbols.find(value => value.id == symbolId);
            if (!symbolData) {
                throw `no symbol data for symbolId: ${symbolId}`;
            }
            const timeScale = 3 - this.reelIndex * 0.35;
            await symbol.play("win", {loop: false, timeScale});
            symbol.setSkin(symbolData.name.toLowerCase());
            await symbol.play("undim");
            symbol.play("idle", {loop: true});
        }));
    }

    getSymbol(y: number) {
        return this.symbols[y];
    }
}