import MainControl from "app/controls/MainControl";
import {Sprite} from "@pixi/sprite";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";

export class SpriteControl extends MainControl {

    constructor(textureId: string, anchor?: {x: number, y: number}) {
        const sprite = new Sprite(StrictResourcesHelper.getSomeTexture(textureId));
        super(sprite);
        anchor = anchor ?? {x: 0, y: 0};
        sprite.anchor.copyFrom(anchor);
    }
}