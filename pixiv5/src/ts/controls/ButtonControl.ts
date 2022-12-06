import MainControl, {PivotType} from "./MainControl";
import {Container, Filter, Sprite, Texture} from "pixi.js";
import Signal from "../helpers/signals/signal/Signal";
import {GlowFilter} from "@pixi/filter-glow";
import {getCirclePolygons} from "../helpers/GuiMath";

export default class ButtonControl extends MainControl {
    public onClick:Signal<ButtonControl> = new Signal<ButtonControl>();

    private readonly button:PIXI.Container;
    private readonly sepiaColorFilter:PIXI.filters.ColorMatrixFilter;
    private readonly additionalFilters:Array<Filter> = [];

    constructor(texture:Texture | Container, hoverColor:number = 0xffffff, align:PivotType = PivotType.TL) {
        super();
        this.button = texture instanceof Container ? texture : new Sprite(<Texture>texture);
        this.button.interactive = true;
        this.button.buttonMode = true;
        let glowFilter:GlowFilter = new PIXI.filters.GlowFilter({
            color: hoverColor, outerStrength: 50, distance: 10, quality: 0.3
        });
        this.sepiaColorFilter = new PIXI.filters.ColorMatrixFilter();
        this.sepiaColorFilter.sepia(false);
        this.button.on("pointerover", () => {
            this.container.filters = [glowFilter, ...this.additionalFilters];
        });
        this.button.on("pointerout", () => {
            this.container.filters = [...this.additionalFilters];
        });
        this.button.hitArea = new PIXI.Polygon(getCirclePolygons(this.button.width * .5, 10));
        this.button.on("pointerdown", () => {
            if (this.isEnable()) {
                this.onClick.emit(this);
            }
        })
        this.container.addChild(this.button);
        this.setPivotTo(this.button, align);
    }

    set hitArea(value:PIXI.IHitArea) {
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

    addFilter(filter:Filter) {
        this.additionalFilters.push(filter);
        this.container.filters = [...this.additionalFilters];
    }
}