import MainControl, {PivotType} from "./MainControl";
import {Sprite, Texture} from "pixi.js";
import {GlowFilter} from "@pixi/filter-glow";
import Signal from "../helpers/signals/signal/Signal";

export default class ToggleButtonControl extends MainControl {

    private readonly glowFilter:GlowFilter;
    private readonly defaultState:PIXI.Sprite;
    private readonly toggleState:PIXI.Sprite;
    private readonly howerState:PIXI.Sprite;
    public onClick:Signal<ToggleButtonControl> = new Signal<ToggleButtonControl>();
    private isToggled:boolean = false;

    constructor(states:ToggleButtonStates, customGlowFilter:GlowFilter | null = null, pivotType:PivotType = PivotType.BL) {
        super();
        this.defaultState = states.defaultState instanceof Texture ? new Sprite(states.defaultState) : states.defaultState;
        this.toggleState =  states.toggleState instanceof Texture ? new Sprite( states.toggleState) :  states.toggleState;
        states.howerState = states.howerState?states.howerState:states.toggleState;
        this.howerState =   states.howerState instanceof Texture ? new Sprite( states.howerState) :  states.howerState;
        this.setPivotTo(this.defaultState, pivotType);
        this.setPivotTo(this.toggleState, pivotType);
        this.setPivotTo(this.howerState, pivotType);
        this.setPivotTo(this.container, pivotType);
        switch (pivotType) {
            case PivotType.TL:
            case PivotType.T:
            case PivotType.TR:
                // this.defaultState.y -= this.defaultState.height*this.defaultState.scale.y;
                // this.toggleState.y -= this.defaultState.height*this.defaultState.scale.y;
                break;
            case PivotType.BR:
            case PivotType.B:
            case PivotType.BL:
                this.defaultState.y += this.defaultState.height;
                this.toggleState.y += this.defaultState.height;
                this.howerState.y += this.defaultState.height;
                break;
        }
        this.toggleState.visible = false;
        this.howerState.visible = false;
        this.container.addChild(
            this.defaultState,
            this.toggleState,
            this.howerState
        );
        this.glowFilter = customGlowFilter ? customGlowFilter : new PIXI.filters.GlowFilter({
            color: 0xffffff, outerStrength: 50, distance: 10, quality: .3
        });
        this.container.interactive = true;
        this.container.buttonMode = true;
        this.container.on("pointerover", () => {
            if (!this.isToggled) {
                this.defaultState.visible = false;
                this.toggleState.visible = false;
                this.howerState.visible = true;
            }
        });
        this.container.on("pointerout", () => {
            if (!this.isToggled) {
                this.container.filters = [];
                this.defaultState.visible = true;
                this.toggleState.visible = false;
                this.howerState.visible = false;
            }
        });
        this.container.on("pointerdown", () => {
            if (this.isEnable()) {
                this.onClick.emit(this);
            }
        })
    }

    isEnable() {
        return this.container.alpha === 1;
    }

    enable() {
        this.container.alpha = 1;
    }

    disable() {
        if (this.container.alpha === 1) {
            this.container.alpha += 1;
        }
    }

    toggle(value:boolean = true) {
        this.isToggled = value;
        this.container.filters = this.isToggled ? [this.glowFilter] : [];
        this.toggleState.visible = this.isToggled;
        this.howerState.visible = false;
        this.defaultState.visible = !this.isToggled;
    }
}

type ToggleButtonStates = {
    defaultState:Texture | Sprite,
    toggleState:Texture | Sprite,
    howerState?:Texture | Sprite,
}