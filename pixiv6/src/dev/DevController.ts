import {GUI} from "dat.gui";
import gameModel from "app/model/GameModel";
import HotKeyTool from "app/dev/HotKeyTool";
import {Main} from "app/Main";
import DevAnimationScene from "app/scenes/DevAnimationScene";
import Stats from "stats.js";
import DevPixiDrawLayoutPlugin from "app/layoutManager/DevPixiDrawLayoutPlugin";
import dependencyManager from "app/model/injection/InjectDecorator";
import LayoutManager from "app/layoutManager/LayoutManager";

export default class DevController {
    private stats:Stats = new Stats();

    constructor() {
        this.setupStats();
        const gui = new GUI();
        this.setupGeneralHooks(gui);
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
                if(layoutManager.hasPlugin(devPixiDrawLayoutPlugin)){
                    layoutManager.removePlugin(devPixiDrawLayoutPlugin);
                } else {
                    layoutManager.addPlugin(devPixiDrawLayoutPlugin);
                }
            }, "show layouts");
        }, "dev tools");
    }

    private setupGeneralHooks(gui:GUI) {
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
}