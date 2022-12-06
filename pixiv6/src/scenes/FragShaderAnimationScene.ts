import BaseScene from "./BaseScene";
import BackgroundControl from "../controls/BackgroundControl";
import gameModel, {GameSize} from "../model/GameModel";
import StrictResourcesHelper from "./../pixi/StrictResourcesHelper";
import FullScreenButtonControl from "app/controls/button/FullScreenButtonControl";
import TextButtonControl from "app/controls/button/TextButtonControl";
import ChoiceScene from "app/scenes/ChoiceScene";
import {promiseDelay} from "app/helpers/TimeHelper";
import {ScaleHelper} from "app/helpers/ScaleHelper";
import frag from "res/shader/sinFrag.frag";
import vertex from "res/shader/defaultVert.vert";
import {Container} from "@pixi/display";
import {Geometry, RenderTexture, Shader} from "@pixi/core";
import {Mesh} from "@pixi/mesh";
import {inject} from "app/model/injection/InjectDecorator";

export default class FragShaderAnimationScene extends BaseScene {
    @inject(FullScreenButtonControl)
    private fullScreenButton:FullScreenButtonControl = <any>{};
    private textButtonControl = new TextButtonControl("Back");
    private waveContainer:Container = new Container();
    private waveQuad:Mesh<Shader> = <any>{};
    private waveTexture:RenderTexture = <any>{};
    private waveUniforms = {amplitude: 0, time: 0};

    compose():void {
        let texture = StrictResourcesHelper.getTexture("UI", "alf-like.png");
        const geometry = new Geometry()
            .addAttribute('aVertexPosition', // the attribute name
                [0, 0, // x, y
                    200, 0, // x, y
                    200, 200,
                    0, 200], // x, y
                2) // the size of the attribute
            .addAttribute('aUvs', // the attribute name
                [0, 0, // u, v
                    1, 0, // u, v
                    1, 1,
                    0, 1], // u, v
                2) // the size of the attribute
            .addIndex([0, 1, 2, 0, 2, 3]);

        this.waveUniforms = {
            amplitude: 0.75,
            time: 0,
        };
        const waveShader = Shader.from(vertex, frag, this.waveUniforms);
        this.waveTexture = RenderTexture.create(200, 200);
        const waveQuad = new Mesh(geometry, waveShader);
        const waveContainer = new Container();
        waveContainer.addChild(waveQuad);
        this.waveContainer = waveContainer;
        this.waveQuad = waveQuad;

        this.textButtonControl.onClick.add(() => {
            gameModel.getHowler().play("btn_click");
            this.sceneManager.navigate(ChoiceScene);
        }, this);
    }

    activate():void {
        super.activate();
        let loopSoundId = gameModel.getHowler().play("relax_loop");
        gameModel.getHowler().volume(0, loopSoundId);
        gameModel.getHowler().fade(0, 1, 1000, loopSoundId);
        this.addToDeactivateList(async () => {
            let duration = 500;
            gameModel.getHowler().fade(1, 0, duration, loopSoundId);
            await promiseDelay(duration * .5);
            gameModel.getHowler().stop(loopSoundId);
        });
        let backgroundControl:BackgroundControl = gameModel.resolve(BackgroundControl);
        this.addControl(backgroundControl);
        this.scene.addChild(this.waveContainer);
        this.addControl(this.textButtonControl);
        this.addControl(this.fullScreenButton);
    }

    protected onResize(gameSize:GameSize) {
        super.onResize(gameSize);
        this.fullScreenButton.container.x = gameSize.width * .9;
        this.fullScreenButton.container.y = gameSize.height * .13;
        this.textButtonControl.container.position.set(
            gameSize.width * .1,
            gameSize.height * .1
        );
        ScaleHelper.scaleToSize(this.waveContainer, gameSize);
    }

    deactivate() {
        super.deactivate();
    }

    dispose() {
        this.textButtonControl.onClick.unload(this);
        super.dispose();
    }

    protected onUpdate(delta:number) {
        super.onUpdate(delta);
        this.waveUniforms.time += 0.01 * delta;
    }

}