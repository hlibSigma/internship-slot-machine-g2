import MainControl from "app/controls/MainControl";
import SpineControl from "app/controls/SpineControl";

export default class SymbolControl extends MainControl {
    private readonly spine: SpineControl;
    private readonly maxPosY: number;

    constructor(size: number, offsetY: number, maxPosY: number) {
        super();

        this.spine = SymbolControl.getSpine(size);
        this.maxPosY = maxPosY;

        this.container.position.set(size, offsetY);

        this.add(this.spine);
    }

    private static getRandomSkin() {
        const skins = [
            "wild",
            "scatter",
            "low1",
            "low2",
            "low3",
            "high1",
            "high2",
            "high3",
        ];

        return skins[Math.floor(Math.random() * skins.length)];
    }

    private static getSpine(size: number) {
        const spine = new SpineControl("symbols");

        spine.setSkin(this.getRandomSkin());
        spine.container.scale.set(size / spine.container.width);

        return spine;
    }
}
