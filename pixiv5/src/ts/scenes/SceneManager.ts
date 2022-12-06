import BaseScene from "./BaseScene";
import LayoutManager from "../layoutManager/LayoutManager";
import {Container} from "pixi.js";
import gameModel, {GameSize} from "../model/GameModel";

export class SceneManager {
    private readonly sceneCache: Map<string, BaseScene>;
    private readonly stage: Container;
    // @ts-ignore
    private activeScene: BaseScene;

    public constructor(protected app:PIXI.Application, private useSceneCache:boolean = true) {
        this.sceneCache = new Map<string, BaseScene>();
        this.stage = app.stage;
    }

    public navigate(targetScreen: typeof BaseScene): void {
        if (this.activeScene != null) {
            this.stage.removeChild(this.activeScene.scene);
            this.activeScene.dispose();
        }

        if (this.sceneCache.has(targetScreen.name) === false) {
            // @ts-ignore
            this.activeScene = new targetScreen(this, this.app);
            if (this.useSceneCache) {
            this.sceneCache.set(targetScreen.name, this.activeScene);
            }
        } else {
            // @ts-ignore
            this.activeScene = this.sceneCache.get(targetScreen.name);
        }

        this.stage.addChild(this.activeScene.scene);
        this.activeScene.compose();
        LayoutManager.UPDATE.emit(null);
        let gameSize:GameSize = {
            scale: 1920 * this.app.renderer.width / 1920,
            width: this.app.renderer.width,
            height: this.app.renderer.height
        }
        gameModel.updateLayout.emit(gameSize);
    }
}
