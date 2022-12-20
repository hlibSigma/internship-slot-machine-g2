import {Container, DisplayObject} from "@pixi/display";

export default abstract class MainControl {
    public static _UID: number = 1;
    public readonly uid: number = MainControl._UID++;
    public readonly container: Container;

    protected constructor(container?: Container) {
        this.container = container ?? new Container();
        this.container.on("added", this.init, this);
        this.container.on("removed", this.dispose, this);
    }

    add(control: MainControl): void {
        this.container.addChild(control.container);
    }

    remove(control: MainControl): void {
        this.container.removeChild(control.container);
    }

    setPivotTo(displayObject: DisplayObject & {width: number, height: number} = this.container, type: PivotType = PivotType.C) {
        let scaleX = displayObject.scale.x;
        displayObject.scale.set(1);
        let width = displayObject.width;
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

    init() {

    }

    dispose() {

    }

    name(name: string): this {
        this.container.name = name;
        return this;
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