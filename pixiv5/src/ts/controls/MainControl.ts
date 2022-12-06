import {Container, DisplayObject} from "pixi.js";

export default abstract class MainControl {
    public readonly container:PIXI.Container;

    protected constructor() {
        this.container = new Container();
    }

    add(control:MainControl):void {
        this.container.addChild(control.container);
    }

    remove(control:MainControl):void {
        this.container.removeChild(control.container);
    }

    setPivotTo(displayObject:DisplayObject = this.container, type:PivotType = PivotType.C) {
        let scaleX = displayObject.scale.x;
        displayObject.scale.set(1);
        // @ts-ignore
        let width = displayObject.width;
        // @ts-ignore
        let height = displayObject.height;
        let centerX = width * .5;
        let centerY = height * .5;
        switch (type) {
            case PivotType.C:
                displayObject.pivot.set(centerX, centerY);
                break;
            case PivotType.L:
                displayObject.pivot.set(0, centerY);
                break;
            case PivotType.TL:
                displayObject.pivot.set(0, 0);
                break;
            case PivotType.T:
                displayObject.pivot.set(centerX, 0);
                break;
            case PivotType.TR:
                displayObject.pivot.set(width, 0);
                break;
            case PivotType.R:
                displayObject.pivot.set(width, centerY);
                break;
            case PivotType.BR:
                displayObject.pivot.set(width, height);
                break;
            case PivotType.B:
                displayObject.pivot.set(centerX, height);
                break;
            case PivotType.BL:
                displayObject.pivot.set(0, height);
                break;
        }
        displayObject.scale.set(scaleX);
    }

}

export enum PivotType {
    C,
    L,
    TL,
    T,
    TR,
    R,
    BR,
    B,
    BL,
}