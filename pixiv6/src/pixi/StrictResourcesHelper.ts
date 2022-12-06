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
    
}