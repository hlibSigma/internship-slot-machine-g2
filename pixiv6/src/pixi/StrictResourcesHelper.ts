import {Loader} from "@pixi/loaders";
import {Texture} from "@pixi/core";

export default class StrictResourcesHelper {

    static getTexture(spritesheetId:string, textureId:string):Texture {
        let spritesheet = Loader.shared.resources[spritesheetId].spritesheet;
        if (!spritesheet) {
            throw `${spritesheetId} spritesheet is not defined`;
        }
        let texture:Texture = spritesheet.textures[textureId];
        if (!texture) {
            throw `${textureId} texture is not defined in ${spritesheetId} spritesheet`;
        }
        return texture;
    }

    static getSingleTexture(textureId: string): Texture {
        const texture = Loader.shared.resources[textureId].texture;

        if (!texture) {
            throw `${texture} texture is not defined!`;
        }

        return texture;
    }

    static getAnimation(spritesheetId: string, animationId: string): Texture[] {
        const spritesheet = Loader.shared.resources[spritesheetId].spritesheet;

        if (!spritesheet) {
            throw `${spritesheetId} spritesheet is not defined!`;
        }

        const animation = spritesheet.animations[animationId];

        if (!animation) {
            throw `${animationId} animation is not defined in ${spritesheetId} spritesheet!`;
        }

        return animation;
    }
    
}