import PIXI, {Application, Loader} from "pixi.js";
import BackgroundControl from "../controls/BackgroundControl";
import BaseScene from "./BaseScene";
import StrictResourcesHelper from "../pixi/StrictResourcesHelper";
import gameModel from "../model/GameModel";
import {SceneManager} from "./SceneManager";
import AlphaFadeInEffect from "../pixi/effects/AlphaFadeInEffect";
import GameTitle from "../controls/GameTitle";
import MainScene from "./MainScene";
import HtmlBackgroundControl from "../controls/HtmlBackgroundControl";
import SimpleLoaderControl from "../controls/SimpleLoaderControl";

export default class LoaderScene extends BaseScene {
    private readonly gameTitle:PIXI.Container;
    private timeoutBeforeShowTheGame:number = -1;
    private gameLoadTime:number = -1;
    private simpleLoaderContainer:PIXI.Container;

    private simpleLoaderControl = new SimpleLoaderControl();

    constructor(sceneManager:SceneManager, app:Application) {
        super(sceneManager, app);
        let title = gameModel.getSkinParamsReader().getTitle();
        this.gameTitle = new GameTitle(title).container;
        this.simpleLoaderContainer = this.simpleLoaderControl.container;
    }

    compose():void {
        let skinParamsReader = gameModel.getSkinParamsReader();
        let htmlBackgroundControl = new HtmlBackgroundControl(skinParamsReader.getBgPath());
        document.body.prepend(htmlBackgroundControl.background);
        this.app.stage.addChild(this.gameTitle);
        this.app.stage.addChild(this.simpleLoaderContainer);
        new AlphaFadeInEffect(this.simpleLoaderContainer, this.app.ticker);
        PIXI.Loader.shared.add('UI', 'assets/atlases/ui.json');
        PIXI.Loader.shared.add('config', 'assets/config.json');
        PIXI.Loader.shared.onComplete.add(this.onLoadComplete.bind(this));
        PIXI.Loader.shared.onProgress.add((loader:Loader) => {
            this.simpleLoaderControl.update(loader.progress / 100)
        });
        this.simpleLoaderControl.update(0.1);
        PIXI.Loader.shared.load();
        this.gameLoadTime = Date.now();
        this.gameLoadTime = Date.now();
        gameModel.updateLayout.add(gameSize => {
            this.gameTitle.x = gameSize.width * .5;
            this.gameTitle.y = gameSize.height * .15;
            this.simpleLoaderContainer.x = gameSize.width * .5;
            this.simpleLoaderContainer.y = gameSize.height * .5;
        }, this);
        window.document.body.onclick = ev => {
            gameModel.userInteractionIsPresent = true;
        };
    }

    dispose():void {
        this.scene.removeChildren();
        gameModel.unload(this);
    }

    private onLoadComplete() {
        let texture = StrictResourcesHelper.getTexture("UI", "game_bg.png");
        let backgroundControl = new BackgroundControl(texture);
        gameModel.controls.set(BackgroundControl, backgroundControl);
        this.app.stage.addChild(this.gameTitle);
        setTimeout(() => {
            this.sceneManager.navigate(MainScene);
        }, this.timeoutBeforeShowTheGame - (Date.now() - this.gameLoadTime));
    }

}