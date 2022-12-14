import * as spineboy from "res/spine/spineboy/spineboy-pro.json";
import * as symbols from "res/spine/symbols/symbols.json";

import {AtlasAttachmentLoader, SkeletonJson} from "@pixi-spine/runtime-4.0";
import {SkeletonData, Spine, TextureAtlas} from "@pixi-spine/all-4.0";
import {RenderTexture, Texture} from "@pixi/core";
import {Loader} from "@pixi/loaders";

interface SpineData {
    skeleton:{hash:string, spine:string, x:number, y:number, width:number, height:number, images:string, audio:string};
    bones:[];
    slots:[];
    skins:[{attachments?:any}];
    animations:{
        animation:{
            slots:{},
            bones:{}
        }
    }
}

export default class SpineLoader {
    private static REPLACE_TEXTURE:Texture = RenderTexture.create({width: 100, height: 100});

    static init(texture:Texture) {
        this.REPLACE_TEXTURE = texture;
    }

    static CACHE:{[key:string]:any} = {
        // windmill:windmill,
        spineboy: spineboy,
        symbols: symbols,
    };

    static getSpine(name:string):Spine {
        let spineData = SpineLoader.getSpineData(this.CACHE[name], name);
        return new Spine(spineData);
    }

    private static getSpineData(spineData:SpineData, textureName:string):SkeletonData {
        const textures = this.getSpineTexturesMap(spineData, textureName);
        return this.buildSkeleton(textures, spineData);
    }

    private static buildSkeleton(texturesCache:any, jsonData:any):SkeletonData {
        const spineAtlas = new TextureAtlas();
        spineAtlas.addTextureHash(texturesCache, true);
        const spineAtlasLoader = new AtlasAttachmentLoader(spineAtlas);
        const spineJsonParser = new SkeletonJson(spineAtlasLoader);
        return spineJsonParser.readSkeletonData(jsonData);
    }

    private static getSpineTexturesMap(spineJson:SpineData, textureName:string):{[key:string]:Texture} {
        const res:{[key:string]:Texture} = {};
        const imageNames = this.getImageNames(spineJson);

        for (const name of imageNames) {
            let resource = Loader.shared.resources[textureName];
            if (resource != null && resource.textures && resource.textures[name]) {
                res[name] = resource.textures[name];
            } else {
                res[name] = SpineLoader.REPLACE_TEXTURE;
                console.warn("Resource not found, make sure this is lazy loaded", `[${name}]`);
            }
        }

        return res;
    }

    private static getImageNames(json:SpineData):Array<string> {
        const images:Array<string> = [];
        if (json.skins) {
            const skins = json.skins;
            for (let i:number = 0; i < skins.length; i++) {
                const skin = skins[i];
                if (!skin.attachments) continue;
                for (const attachmentName of Object.keys(skin.attachments)) {
                    const attachment = skin.attachments[attachmentName];
                    for (const attachmentPartName of Object.keys(attachment)) {
                        const attachmentPart = attachment[attachmentPartName];
                        if (attachmentPart && attachmentPart.type == "boundingbox") {
                            continue;
                        }
                        let imageName:string;
                        if (attachmentPart && attachmentPart.name) {
                            imageName = attachmentPart.name;
                        } else if (attachmentPart && attachmentPart.path) {
                            imageName = attachmentPart.path;
                        } else {
                            imageName = attachmentPartName;
                        }
                        if (images.indexOf(imageName) == -1) {
                            images.push(imageName);
                        }
                    }

                }
            }
        }
        return images;
    }
}