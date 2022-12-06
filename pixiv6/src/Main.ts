import LoaderScene from "./scenes/LoaderScene";
import SceneManager from "./scenes/SceneManager";
import gameModel, {GameSize} from "app/model/GameModel";
import DevController from "app/dev/DevController";
import {Application} from "@pixi/app";
import {Ticker, TickerPlugin} from "@pixi/ticker";
import {AppLoaderPlugin, Loader} from "@pixi/loaders";
import {SpritesheetLoader} from "@pixi/spritesheet";
import {BaseRenderTexture, BatchRenderer, Renderer, RenderTexture, Texture} from "@pixi/core";
import {Container} from "@pixi/display";
import {InteractionManager} from "@pixi/interaction";
import {Graphics} from "@pixi/graphics";
import SpineLoader from "app/loader/SpineLoader";
import {devPixiInit} from "app/dev/DevPixiInit";
import "res/styles/main.css";
import {WebfontLoaderPlugin} from "pixi-webfont-loader";
import {BitmapFontLoader} from "@pixi/text-bitmap";
import LayoutManager, {Layout} from "app/layoutManager/LayoutManager";
import dependencyManager from "app/model/injection/InjectDecorator";
import PixiLayoutPlugin from "app/layoutManager/PixiLayoutPlugin";

document.body.style.margin = "0";
document.body.style.overflow = "hidden";
console.log("Hello World");

let globalScale = 1;
export let gameSize:GameSize = {
    width: 1920 * globalScale,
    height: 1080 * globalScale,
    scale: globalScale,
    centerPosition:{x:1920 * globalScale * .5, y:1080 * globalScale * .5},
};

export class Main {

    private readonly app:Application;
    public static APP:Application;
    public static MAIN:Main;
    private dt:number = -1;
    private udateLayoutTimeoutId:number = 0;

    public mainSceneManager:SceneManager;

    constructor() {
        Main.MAIN = this;
        Application.registerPlugin(TickerPlugin);
        Application.registerPlugin(AppLoaderPlugin);
        Loader.registerPlugin(SpritesheetLoader);
        Renderer.registerPlugin("batch", BatchRenderer);
        Renderer.registerPlugin("interact", InteractionManager);
        Loader.registerPlugin(WebfontLoaderPlugin);
        Loader.registerPlugin(BitmapFontLoader);
        //todo: comment for production build ```__DEV__ ? devPixiInit()``` This will be save 200kb; Good thinks to automate this;
        this.app = __DEV__ ? devPixiInit() : new Application({
            width: gameSize.width,
            height: gameSize.height,
            backgroundColor: 0x000000,
            transparent: true
        });
        Main.APP = this.app;
        this.initSpineLoader();
        document.body.appendChild(this.app.view);
        this.mainSceneManager = new SceneManager(this.app, false);
        this.mainSceneManager.navigate(LoaderScene);
        const layoutManager = new LayoutManager(() => {
            window.dispatchEvent(new Event("resize"));
        });
        dependencyManager.register(LayoutManager, layoutManager);
        dependencyManager.register(Ticker, this.app.ticker);
        gameModel.updateLayout.add(layoutManager.update, layoutManager);
        layoutManager.addPlugin(new PixiLayoutPlugin(this.app.stage));
        window.addEventListener('resize', this.resize.bind(this), {capture: true});
        this.resize();
        gameModel.pauseGame.add((opt)=>{
            if(opt.pause){
                this.app.ticker.stop();
            } else {
                this.app.ticker.start();
            }
        })
    }

    private async resize() {
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;
        let width = 1920;
        let height = 1080;
        let scale = Math.min(innerWidth / width, innerHeight / height);
        let newWidth = Math.max(innerWidth / scale, width);
        let newHeight = Math.max(innerHeight / scale, height);
        this.app.renderer.resize(
            newWidth,
            newHeight
        );
        console.log("resize: ", {
            width,
            innerWidth,
            newWidth,
            height,
            innerHeight,
            newHeight,
            scale,
        });
        let canvas:HTMLCanvasElement = this.app.view;
        canvas.style.width = newWidth * scale + 'px';
        canvas.style.height = newHeight * scale + 'px';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.marginTop = `${(innerHeight - newHeight * scale) / 2}px`;
        canvas.style.marginLeft = `${(innerWidth - newWidth * scale) / 2}px`;
        gameSize.scale = this.app.renderer.width / 1920;
        gameSize.width = this.app.renderer.width;
        gameSize.height = this.app.renderer.height;
        gameSize.centerPosition = {
            x: gameSize.width * .5,
            y: gameSize.height * .5
        };
        if (this.dt == -1) {
            this.dt = Date.now();
        } else {
            clearTimeout(this.udateLayoutTimeoutId);
        }
        gameModel.pauseGame.emit({pause:true});
        this.udateLayoutTimeoutId = setTimeout(async () => {
            await gameModel.updateLayout.emit(gameSize).all();
            gameModel.pauseGame.emit({pause:false});
            console.log("updateLayout dt", Date.now() - this.dt);
            this.dt = -1;
        }, 10);
    }

    public getTexture(containerToRender:Container):Texture {
        const bounds = containerToRender.getBounds();
        const baseRenderTexture = new BaseRenderTexture({width: bounds.width, height: bounds.height});
        const renderTexture = new RenderTexture(baseRenderTexture);
        this.app.renderer.render(containerToRender, {renderTexture});
        return renderTexture;
    }

    private initSpineLoader() {
        let size = 500;
        let graphics = new Graphics()
            .beginFill(0xffffff, 1)
            .drawRect(0, 0, size, size);
        let step = size / 10;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                graphics
                    .beginFill(0xff0000, 1)
                    .drawRect((i - j % 2) * step, (j - i % 2) * step, step, step);
            }
        }
        graphics.drawRect(9 * step, 9 * step, step, step);

        let texture = this.getTexture(graphics);
        SpineLoader.init(texture);
        /*
        //todo: uncomment to look on texture
        let sprite = new Sprite(texture);
        sprite.anchor.set(0.5);
        gameModel.updateLayout.add(value => {
            sprite.parent.addChild(sprite);
            sprite.position.set(value.width * 0.5, value.height * 0.5);
        });
        this.app.stage.addChild(sprite);*/
    }
}


gameModel.initHowler().then(_ => {
    new Main();
    if (__DEV__) {
        new DevController();
    }
});