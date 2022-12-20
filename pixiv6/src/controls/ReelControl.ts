import MainControl from "app/controls/MainControl";
import {Container} from "@pixi/display";
import gameModel from "app/model/GameModel";
import SpineControl from "app/controls/SpineControl";
import {promiseDelay} from "app/helpers/TimeHelper";

export default class ReelControl extends MainControl {
    private skinIndex = 0;
    private readonly skins = [
        "wild",
        "scatter",
        "low1",
        "low2",
        "low3",
        "high1",
        "high2",
        "high3",
    ];
    private animationIndex = 0;
    private readonly animations = [
        "idle",
        "win",
        "land",
        "dim",
        "undim",
    ];
    private readonly symbols: SpineControl[] = [];

    constructor(protected strips: number[][]) {
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
            spriteControl.setSkin(this.skins[this.skinIndex])
            spriteControl.play(this.animations[this.animationIndex], {loop: true})
            this.symbols.push(spriteControl);
        }
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
            symbol.play("dim");
            await promiseDelay(2.5 * 1000);
            symbol.play("undim");
        }));
    }
}