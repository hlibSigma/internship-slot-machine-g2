import Signal from "../helpers/signals/signal/Signal";
import {Howl} from "howler";
import ServerCommunicator from "../helpers/ServerCommunicator";
import MainControl from "../controls/MainControl";

export class GameModel {

    public readonly updateLayout:Signal<GameSize> = new Signal<GameSize>();
    //todo: should be not a map - instance;
    public readonly controls:Map<Function, MainControl> = new Map();
    private howler:Howl = <any>{};
    userInteractionIsPresent:boolean = false;

    initHowler():Promise<string|void> {
        let root = location.origin + location.pathname.replace(/\/\w+\.html/, "");
        let action = "/assets/sounds/SOUND_FILE.soundmap.json";
        return ServerCommunicator.get(action, root).then(soundConfigContent => {
            let soundConfig:TSoundConfig = JSON.parse(soundConfigContent);
            console.warn("config", soundConfig);
            this.howler = new Howl({
                src: soundConfig.src,
                sprite: soundConfig.sprite,
                autoplay: false,
                onend: function () {
                    console.warn('Finished!');
                }, onloaderror: soundId => {
                    console.error('onloaderror: ' + soundId, soundConfig);
                }
            });
            this.howler.load();
        })
    }

    getSkinParamsReader():SkinParamsReader {
        return new SkinParamsReader();
    }

    unload($this:any) {
        this.updateLayout.unload($this);
    }
}

class SkinParamsReader {

    getTitle(defaultValue:string = `INITIAL SPINNER`):string {
        let search = window.location.href;
        let regexp = /([?&])title=([^&#]*)/
        let match = search.match(regexp);
        let title;
        if (match && match.length > 2) {
            title = match[2]
        } else {
            title = defaultValue;
            console.warn(`title cannot be read, by default was set: [${title}]`);
        }
        return decodeURI(title);
    }

    getHueDegree():number {
        let search = window.location.href;
        let regexp = /(([?&])hue=(\d+))/
        let match = search.match(regexp);
        let hue;
        if (match && match.length > 0) {
            hue = match[3];
        } else {
            hue = `0`;
            console.warn(`hue cannot be read, by default was set: [${hue}]`);
        }
        return parseInt(hue);
    }

    getBgPath(defaultValue = "'assets/images/game_bg.png'"):string {
        let search = window.location.href;
        console.log(search)
        let regexp = new RegExp(/([?&])bg=((\w|\d|[:.\/\-])+)/);
        let match = search.match(regexp);
        let bgPath;
        if (match && match.length > 0) {
            bgPath = match[2];
        } else {
            bgPath = defaultValue;
            console.warn(`bgPath cannot be read, by default was set: [${bgPath}]`);
        }
        return bgPath;
    }
}

export type GameSize = {
    width:number;
    height:number;
    scale:number;
}

type TSoundConfig = {
    src:string[];
    sprite:{ [name:string]:[number, number] | [number, number, boolean] };
}

let gameModel = new GameModel();
export default gameModel;