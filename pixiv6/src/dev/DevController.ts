import {GUI} from "dat.gui";
import gameModel from "app/model/GameModel";
import HotKeyTool from "app/dev/HotKeyTool";
import {Main} from "app/Main";
import DevAnimationScene from "app/scenes/DevAnimationScene";
import Stats from "stats.js";
import DevPixiDrawLayoutPlugin from "app/layoutManager/DevPixiDrawLayoutPlugin";
import dependencyManager from "app/model/injection/InjectDecorator";
import LayoutManager from "app/layoutManager/LayoutManager";
import DevToolUtils from "app/dev/DevToolUtils";
import sounds from "res/sounds/SOUND_FILE.soundmap.json";

export default class DevController {
    private stats: Stats = new Stats();

    constructor() {
        this.setupStats();
        const gui = new GUI();
        this.setupGeneralHooks(gui);
        this.setupSlotMachineHooks(gui);
        this.setupPacmanHooks(gui);
        this.setupSounds(gui);
        gui.add({
            gameLayoutTest: () => {
                gameModel.updateLayout.emit({
                    height: 800,
                    width: 600,
                    scale: 2,
                    centerPosition: {x: 400, y: 300}
                });
            }
        }, "gameLayoutTest");

        const hotKeyTool = HotKeyTool.instance;
        hotKeyTool.registerOnKey("N", () => {
            hotKeyTool.registerOnKey("1", () => {
                Main.MAIN.mainSceneManager.navigate(DevAnimationScene);
            }, "DevAnimationScene");
        });
        const devPixiDrawLayoutPlugin = new DevPixiDrawLayoutPlugin(Main.APP.stage);
        hotKeyTool.registerOnKey("D", () => {
            hotKeyTool.registerOnKey("1", () => {
                this.stats.dom.style.opacity = this.stats.dom.style.opacity == "0.9" ? "0.2" : "0.9";
            }, "stats visibility");
            hotKeyTool.registerOnKey("2", () => {
                let layoutManager = dependencyManager.resolve(LayoutManager);
                if (layoutManager.hasPlugin(devPixiDrawLayoutPlugin)) {
                    layoutManager.removePlugin(devPixiDrawLayoutPlugin);
                } else {
                    layoutManager.addPlugin(devPixiDrawLayoutPlugin);
                }
            }, "show layouts");
        }, "dev tools");
    }

    private setupSlotMachineHooks(gui: GUI) {
        const SlotMachineGui = gui.addFolder("Slot Machine");

        SlotMachineGui.add({
            startSpinning: () => gameModel.startSpinning.emit(),
        }, "startSpinning");

        for (const hook of gameModel.reelBoxOnChangeHooks) {
            SlotMachineGui.add(hook.target, hook.propName)
                          .onChange(value => hook.signal.emit(value));
        }
    }

    private setupPacmanHooks(gui: GUI) {
        let guiPacman = gui.addFolder("packman");
        let target = {
            left: () => {
                console.log("left");
                gameModel.updateOrientation.emit("left");
            },
            right: () => {
                console.log("right");
                gameModel.updateOrientation.emit("right");
            }
        };
        guiPacman.add(target, "left");
        guiPacman.add(target, "right");
        guiPacman.add({speedFactor: 3}, "speedFactor").onChange(value => {
            console.log("value", value);
            gameModel.setSpeedFactor.emit(value);
        });
        guiPacman.add({
            run: () => {
                gameModel.devAnimation.run.emit();
            }
        }, "run");
    }

    private setupGeneralHooks(gui: GUI) {
        let generalGui = gui.addFolder("general");
        generalGui.add({
            play: () => {
                gameModel.pauseGame.emit({pause: false});
            }
        }, "play");
        generalGui.add({
            pause: () => {
                gameModel.pauseGame.emit({pause: true});
            }
        }, "pause");
    }

    private setupStats() {
        const stats = this.stats;
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom);
        Main.APP.ticker.add(dt => {
            stats.update();
        });
    }

    private setupSounds(gui: GUI) {
        let howler = gameModel.getHowler();
        let soundIdItems = Object.getOwnPropertyNames(sounds.sprite);
        let id: number;
        let target = {
            rate: 1,
            _rateMin: -1,
            _rateMax: 10,
            _rateStep: 0.01,
            _rateUpdate: (data:any)=>{
                console.log(data);
                howler.rate(data, id);
            },
            volume: 1,
            _volumeMin: 0,
            _volumeMax: 1,
            _volumeStep: 0.01,
            _volumeUpdate: (data:any)=>{
                console.log(data);
                howler.volume(data);
            },
            soundId: "success",
            _soundIdItems: soundIdItems,
            play: () => {
                id = howler.play(target.soundId);
            },
            stop: () => {
                howler.stop(id);
            },
            unPause: () => {
                howler.play(id);
            },
            mute: () => {
                howler.mute(true);
            },
            unMute: () => {
                howler.mute(false);
            },
            fadeIn: () => {
                id = howler.play(target.soundId);
                howler.fade(0, 1, 3000, id);
            },
            fadeOut: () => {
                id = howler.play(target.soundId);
                howler.fade(1, 0, 3000, id);
            },
            fade: () => {
                howler.fade(1, 0, 1500, id);
                id = howler.play(target.soundId);
                howler.fade(0, 1, 3000, id);
            },
        };
        DevToolUtils.setupObj(target, "sounds", gui);
    }
}