import MainControl, {PivotType} from "./../MainControl";
import {GlowFilter} from "@pixi/filter-glow";
import {ColorMatrixFilter} from "@pixi/filter-color-matrix";
import Signal from "app/helpers/signals/signal/Signal";
import {Container} from "@pixi/display";
import {Filter, Texture} from "@pixi/core";
import {Sprite} from "@pixi/sprite";

export type ButtonControlOptions = {hoverColor?: number, align?: PivotType, target?: any}
export default class ButtonControl extends MainControl {
    public readonly onClick: Signal<ButtonControl> = new Signal<ButtonControl>();
    public readonly target: any;

    private readonly button: Container;
    private readonly sepiaColorFilter: ColorMatrixFilter;
    private readonly additionalFilters: Array<Filter> = [];
    private readonly glowFilter: Filter;

    constructor(texture: Texture | Container, opt?: ButtonControlOptions) {
        super();
        opt = opt ? opt : {};
        opt.hoverColor = opt.hoverColor === undefined ? 0xffffff : opt.hoverColor;
        opt.align = opt.align === undefined ? PivotType.TL : opt.align;
        this.target = opt.target;
        this.button = texture instanceof Container ? texture : new Sprite(<Texture>texture);
        this.button.interactive = true;
        this.button.buttonMode = true;
        this.glowFilter = new GlowFilter({
            color: opt.hoverColor, outerStrength: 50, distance: 10, quality: 0.3
        });
        this.sepiaColorFilter = new ColorMatrixFilter();
        this.sepiaColorFilter.sepia(false);

        // this.button.hitArea = new Polygon(getCirclePolygons(this.button.width * .5, 10));

        this.container.addChild(this.button);
        this.setPivotTo(this.button, opt.align);
    }

    init() {
        super.init();
        this.container.on("pointerover", () => {
            this.container.filters = [this.glowFilter, ...this.additionalFilters];
        });
        this.container.on("pointerout", () => {
            this.container.filters = [...this.additionalFilters];
        });
        this.container.on("pointertap", () => {
            console.log("pointertap");
            if (this.isEnable()) {
                console.log("emit");
                this.onClick.emit(this);
            }
        });
        this.container.interactive = true;
        this.container.interactiveChildren = true;
        this.container.buttonMode = true;
    }

    set hitArea(value: IHitArea) {
        this.button.hitArea = value;
    }

    isEnable() {
        return this.button.alpha === 1;
    }

    enable() {
        this.button.alpha = 1;
        this.button.filters = [];
        this.button.interactive = true;
        this.button.buttonMode = true;
    }

    disable() {
        if (this.button.alpha === 1) {
            this.button.filters = [this.sepiaColorFilter];
            this.button.interactive = false;
            this.button.buttonMode = false;
            this.container.filters = [...this.additionalFilters];
            this.button.alpha += 1;
        }
    }

    addFilter(filter: Filter) {
        this.additionalFilters.push(filter);
        this.container.filters = [...this.additionalFilters];
    }
}
//todo: after new api of pixi will be released;
// For now it is not export
interface IHitArea {
    contains(x: number, y: number): boolean;
}