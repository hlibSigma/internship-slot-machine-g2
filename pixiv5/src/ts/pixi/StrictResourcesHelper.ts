import Texture = PIXI.Texture;
import PIXI from "pixi.js";

export default class StrictResourcesHelper {

    static getTexture(spritesheetId:string, textureId:string):Texture {
        let spritesheet = PIXI.Loader.shared.resources[spritesheetId].spritesheet;
        if (!spritesheet) {
            throw `${spritesheetId} spritesheet is not defined`;
        }
        let texture = spritesheet.textures[textureId];
        if (!texture) {
            throw `${textureId} texture is not defined in ${spritesheetId} spritesheet`;
        }
        return texture;
    }
    
}