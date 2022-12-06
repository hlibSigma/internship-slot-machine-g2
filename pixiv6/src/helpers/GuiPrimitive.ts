import {Renderer, Texture} from "@pixi/core";
import {Rectangle} from "@pixi/math";
import {SCALE_MODES} from "@pixi/constants";
import {Graphics} from "@pixi/graphics";

export function getCircleTexture(renderer:Renderer, radius:number, color:number = 0xff0000, alpha:number = 1):Texture {
    let circle = getCircle(radius, color, alpha);
    let rectangle = new Rectangle(-radius-2, -radius-2, radius * 2, radius * 2);
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
    private __width:number = 0;
    private __height:number = 0;
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
        this.clear();
        this.beginFill(this._bgColor, this._alpha);
        this.drawRoundedRect(0, 0, this.__width, this.__height, this._radius);
        this.endFill();
        this.x = 0;
        this.y = 0;
        return this;
    }

    updateWidth(value:number):RoundRect {
        this.__width = value;
        return this;
    }

    updateHeight(value:number):RoundRect {
        this.__height = value;
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