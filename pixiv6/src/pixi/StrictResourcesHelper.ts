import {Loader} from "@pixi/loaders";
import {Texture} from "@pixi/core";

export default class StrictResourcesHelper {

    static getSomeTexture(textureId: string): Texture {
        let loader = Loader.shared;
        let keys = Object.getOwnPropertyNames(loader.resources);
        keys = keys.filter(key => {
            let spriteSheet = loader.resources[key].spritesheet;
            if (!spriteSheet) {
                return false;
            }
            let texture = spriteSheet.textures[textureId];
            return texture != null;
        });
        if (keys.length == 0) {
            throw `${textureId} texture is not defined in any spritesheets`;
        }
        return this.getTexture(keys[0], textureId);
        // let texture = loader.resources[keys[0]].spritesheet[textureId].texture;
        // if (!texture) {
        //     throw `${textureId} texture is not defined in any spritesheets`;
        // }
        // return texture;
    }

    static getTexture(spritesheetId: string, textureId: string): Texture {

        let spritesheet = Loader.shared.resources[spritesheetId].spritesheet;
        if (!spritesheet) {
            throw `${spritesheetId} spritesheet is not defined`;
        }
        let texture: Texture = spritesheet.textures[textureId];
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