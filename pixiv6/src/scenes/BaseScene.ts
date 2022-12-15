import SceneManager from "./SceneManager";
import gameModel, {GameSize} from "../model/GameModel";
import MainControl from "app/controls/MainControl";
import {Container} from "@pixi/display";
import {Application} from "@pixi/app";
import Scene from "app/scenes/model/Scene";

export default abstract class BaseScene implements Scene {

    readonly scene: Container = new Container();
    private readonly toDisposeList: Array<() => void> = [];
    private readonly toDeactivateList: Array<() => void> = [];
    private readonly customTickers: Map<(dt:number) => void, (dt:number) => void> = new Map();

    protected constructor(protected sceneManager: SceneManager, protected app: Application) {
    }

    abstract compose(): void;

    activate(): void {
        gameModel.updateLayout.add((value, resolve) => {
            this.onResize(value);
            resolve!();
        }, this);
        this.app.ticker.add(this.onUpdate, this);
    }

    deactivate(): void {
        this.app.ticker.remove(this.onUpdate, this);
        gameModel.unload(this);
        this.toDeactivateList.forEach(value => value());
        this.toDeactivateList.length = 0;
    }

    dispose(): void {
        this.toDisposeList.forEach(value => value());
        this.toDisposeList.length = 0;
        this.scene.removeChild(...this.scene.children);
    };

    protected addToDispose(func: () => void) {
        this.toDisposeList.push(func);
    }

    protected addToDeactivateList(func: () => void) {
        this.toDeactivateList.push(func);
    }

    protected removeFromTicker(cbf: (dt: number) => void) {
        const param = this.customTickers.get(cbf) ?? cbf;
        this.app.ticker.remove(param, this);
    }

    //todo:move to some ticker helper or extension;
    protected addToTicker(param: (dt: number) => void, def?: {interval?: number, callsLimit?: number}) {
        def = def ?? {callsLimit: -1, interval: -1};
        const definitions: {interval: number, callsLimit: number} = {
            interval: def.interval == undefined ? -1 : def.interval,
            callsLimit: def.callsLimit == undefined ? -1 : def.callsLimit,
        }
        const app = this.app;
        if (definitions.interval > 0 || definitions.callsLimit > 0) {
            const cbF = param;
            const ctx = this;
            let dateNow = Date.now();
            param = function (dt) {
                let deltaTime = (Date.now() - dateNow);
                if (deltaTime > definitions.interval) {
                    dateNow = Date.now();
                    cbF.call(ctx, definitions.interval / deltaTime);
                    definitions.callsLimit--;
                    if (definitions.callsLimit == 0) {
                        app.ticker.remove(param, ctx);
                        ctx.customTickers.delete(cbF);
                    }
                }
            }
            this.customTickers.set(cbF, param);
            this.addToDeactivateList(() => {
                this.customTickers.delete(cbF);
            });
        }
        app.ticker.add(param, this);
        this.addToDeactivateList(() => {
            this.removeFromTicker(param);
        });
    }

    protected addControl(control: MainControl) {
        this.scene.addChild(control.container);
        this.addToDeactivateList(() => {
            control.container.parent && this.scene.removeChild(control.container);
        })
    }

    protected onResize(gameSize: GameSize) {}

    protected onUpdate(delta: number) {}
}