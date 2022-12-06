import {Point} from "pixi.js";

export function getCirclePolygons(radius:number, steps:number, startAngle:number = 0.0, paddingX:number = 0, paddingY:number = 0):Array<number> {
    let polygons:Array<number> = [];
    let angle = startAngle;
    let angleStep = 2 * Math.PI / steps;
    for (let i = 0; i < steps; i++) {
        let point = new Point(Math.cos(angle) * radius, Math.sin(angle) * radius);
        polygons.push(point.x + radius + paddingX);
        polygons.push(point.y + radius + paddingY);
        angle += angleStep;
    }
    return polygons;
}

export function hexToRgb(hex:string):RGB {
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        throw `cannot convert hex: ${hex} to RGBa`
    }
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    };
}

export type RGB = {
    r:number;
    g:number;
    b:number;
    a?:number;
}
