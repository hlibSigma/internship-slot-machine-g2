import * as PIXI from 'pixi.js';

import gameModel, {GameSize} from "./model/GameModel";
import FontFaceLoader from "./helpers/FontFaceLoader";
import {SceneManager} from "./scenes/SceneManager";
import LoaderScene from "./scenes/LoaderScene";
import BaseScene from "./scenes/BaseScene";
let globalScale = 1;
let gameSize:GameSize = {
    width: 1920 * globalScale,
    height: 1080 * globalScale,
    scale: globalScale
}

export class Main {
    private readonly app:PIXI.Application;
    public static APP:PIXI.Application;

    constructor(private mainScene:typeof BaseScene) {
        this.app = new PIXI.Application({
            width: gameSize.width,
            height: gameSize.height,
            backgroundColor: 0x000000,
            transparent: true
        });
        Main.APP = this.app;
        document.body.appendChild(this.app.view);
        new SceneManager(this.app).navigate(mainScene);
        window.addEventListener('resize', this.resize.bind(this), {capture: true});
        this.resize();
    }

    private resize() {
        const innerWidth = window.innerWidth
        const innerHeight = window.innerHeight
        let width = 1920;
        let height = 1080;
        let scale = Math.min(innerWidth / width, innerHeight / height)
        let newWidth = Math.min(innerWidth / scale, width)
        let newHeight = Math.min(innerHeight / scale, height)
        this.app.renderer.resize(
            width * globalScale,
            height * globalScale
        );
        console.log("-=-=-=-=-=-");
        console.log("game width: " + width);
        console.log("game innerWidth: " + innerWidth);
        console.log("game newWidth: " + newWidth);
        console.log("game height: " + height);
        console.log("game innerHeight: " + innerHeight);
        console.log("game newHeight: " + newHeight);
        console.log("game scale: " + scale);
        let canvas:HTMLCanvasElement = this.app.view;
        canvas.style.width = newWidth * scale + 'px';
        canvas.style.height = newHeight * scale + 'px';
        canvas.style.marginTop = `${(innerHeight - newHeight * scale) / 2}px`;
        canvas.style.marginLeft = `${(innerWidth - newWidth * scale) / 2}px`;
        gameSize.scale = this.app.renderer.width / 1920;
        gameSize.width = this.app.renderer.width;
        gameSize.height = this.app.renderer.height;
        gameModel.updateLayout.emit(gameSize);
    }
}