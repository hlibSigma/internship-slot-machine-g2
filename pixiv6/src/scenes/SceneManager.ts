import BaseScene from "./BaseScene";
import gameModel, {GameSize} from "../model/GameModel";
import {Container} from "@pixi/display";
import {Application} from "@pixi/app";

export default class SceneManager {
    private readonly sceneCache: Map<typeof BaseScene, BaseScene>;
    private readonly stage: Container;
    //todo: TBD
    // @ts-ignore
    private activeScene: BaseScene;

    public constructor(protected app: Application, private useSceneCache: boolean = true) {
        this.sceneCache = new Map<typeof BaseScene, BaseScene>();
        this.stage = app.stage;
    }

    public navigate(targetScreen: typeof BaseScene): void {
        if (this.activeScene != null) {
            this.activeScene.deactivate();
            this.stage.removeChild(this.activeScene.scene);
            if (!this.useSceneCache) {
                this.activeScene.dispose();
            }
        }

        if (!this.sceneCache.has(targetScreen)) {
            //todo: TBD
            // @ts-ignore
            this.activeScene = new targetScreen(this, this.app);
            this.activeScene.compose();
            if (this.useSceneCache) {
                this.sceneCache.set(targetScreen, this.activeScene);

            }
        } else {
            let activeScene = this.sceneCache.get(targetScreen);
            if (activeScene) {
                this.activeScene = activeScene;
            }
        }
        this.stage.addChild(this.activeScene.scene);
        this.activeScene.activate();
        let gameSize: GameSize = {
            scale: 1920 * this.app.renderer.width / 1920,
            width: this.app.renderer.width,
            height: this.app.renderer.height,
            centerPosition: {x: this.app.renderer.width * .5, y: this.app.renderer.height * .5},
        };
        gameModel.updateLayout.emit(gameSize);
    }

    public dispose() {
        if (this.activeScene != null) {
            this.activeScene.deactivate();
            this.stage.removeChild(this.activeScene.scene);
            if (!this.useSceneCache) {
                this.activeScene.dispose();
            }
        }
    }
}
