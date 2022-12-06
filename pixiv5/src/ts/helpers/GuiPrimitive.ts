import {Graphics, Renderer, SCALE_MODES, Texture} from "pixi.js";

export function getCircleTexture(renderer:Renderer, radius:number, color:number = 0xff0000, alpha:number = 1):Texture {
    let circle = getCircle(radius, color, alpha);
    let rectangle = new PIXI.Rectangle(-radius-2, -radius-2, radius * 2, radius * 2);
    return renderer.generateTexture(circle, SCALE_MODES.LINEAR, 10, rectangle)
}

export function getCircle(radius:number, color:number = 0xff0000, alpha:number = 1):Graphics {
    let result:Graphics = new Graphics();
    result.beginFill(color, alpha);
    result.drawCircle(0, 0, radius);
    result.endFill();
    return result;
}

export function getRect(w:number, h:number, color:number = 0xff0000, alpha:number = 1):RoundRect {
    return new RoundRect(w, h, 0, color, alpha);
}

export class RoundRect extends Graphics {
    private _width:number = 0;
    private _height:number = 0;
    private _radius:number = 0;
    private _bgColor:number = 0;
    private _alpha:number = 0;

    constructor(width:number, height:number, radius:number = 5, bgColor:number = 0xebeced, alpha:number = 1) {
        super();
        this
            .updateWidth(width)
            .updateHeight(height)
            .updateRadius(radius)
            .updateBgColor(bgColor)
            .updateAlpha(alpha);
        this.update();
    }

    update():RoundRect {
        this.cacheAsBitmap = false;
        this.clear();
        this.beginFill(this._bgColor, this._alpha);
        this.drawRoundedRect(0, 0, this._width, this._height, this._radius);
        this.endFill();
        this.x = 0;
        this.y = 0;
        this.cacheAsBitmap = true
        return this;
    }

    updateWidth(value:number):RoundRect {
        this._width = value;
        return this;
    }

    updateHeight(value:number):RoundRect {
        this._height = value;
        return this;
    }

    updateRadius(value:number):RoundRect {
        this._radius = value;
        return this;
    }

    updateBgColor(value:number):RoundRect {
        this._bgColor = value;
        return this;
    }

    updateAlpha(value:number):RoundRect {
        this._alpha = value;
        return this;
    }
}