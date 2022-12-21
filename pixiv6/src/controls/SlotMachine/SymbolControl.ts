import MainControl from "app/controls/MainControl";
import SpineControl from "app/controls/SpineControl";

export default class SymbolControl extends MainControl {
    private readonly spine: SpineControl;

    constructor(
        private readonly size: number,
        private readonly offsetY = 0,
    ) {
        super();

        this.spine = new SpineControl("symbols");
        this.spine.setSkin(SymbolControl.getRandomSkin());

        this.transformToFit();
        this.add(this.spine);
    }

    public spinTo(target: number, bounds: number) {
        this.spine.container.y = (target % bounds) * this.size - this.size;
    }

    private static getRandomSkin() {
        const skins = [
            "wild", "scatter",
            "low1", "low2", "low3",
            "high1", "high2", "high3",
        ];

        return skins[Math.floor(Math.random() * skins.length)];
    }

    private transformToFit() {
        const { container } = this.spine;

        container.scale.set(Math.min(this.size / container.width, this.size / container.height));

        container.x = Math.round((this.size - container.width) / 2);
        container.y = this.size * this.offsetY;
    }
}
