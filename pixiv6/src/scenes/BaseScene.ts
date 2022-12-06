import SceneManager from "./SceneManager";
import gameModel, {GameSize} from "../model/GameModel";
import MainControl from "app/controls/MainControl";
import {Container} from "@pixi/display";
import {Application} from "@pixi/app";
import Scene from "app/scenes/model/Scene";

export default abstract class BaseScene implements Scene {

    readonly scene:Container = new Container();
    private readonly toDisposeList:Array<() => void> = [];
    private readonly toDeactivateList:Array<() => void> = [];

    protected constructor(protected sceneManager:SceneManager, protected app:Application) {
    }

    abstract compose():void;

    activate():void {
        gameModel.updateLayout.add((value, resolve) => {
            this.onResize(value);
            resolve!();
        }, this);
        this.app.ticker.add(this.onUpdate, this);
    }

    deactivate():void {
        this.app.ticker.remove(this.onUpdate, this);
        gameModel.unload(this);
        this.toDeactivateList.forEach(value => value());
        this.toDeactivateList.length = 0;
    }

    dispose():void {
        this.toDisposeList.forEach(value => value());
        this.toDisposeList.length = 0;
        this.scene.removeChild(...this.scene.children);
    };

    protected addToDispose(func:() => void) {
        this.toDisposeList.push(func);
    }

    protected addToDeactivateList(func:() => void) {
        this.toDeactivateList.push(func);
    }

    protected addToTicker(param:(dt:number) => void) {
        this.app.ticker.add(param, this);
        this.addToDeactivateList(() => {
            this.app.ticker.remove(param, this);
        });
    }

    protected addControl(control:MainControl) {
        this.scene.addChild(control.container);
        this.addToDeactivateList(() => {
            control.container.parent && this.scene.removeChild(control.container);
        })
    }

    protected onResize(gameSize:GameSize) {}

    protected onUpdate(delta:number) {}
}