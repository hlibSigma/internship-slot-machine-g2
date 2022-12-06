import BaseScene from "./BaseScene";
import BackgroundControl from "../controls/BackgroundControl";
import gameModel, {GameSize} from "../model/GameModel";
import StrictResourcesHelper from "./../pixi/StrictResourcesHelper";
import FullScreenButtonControl from "app/controls/button/FullScreenButtonControl";
import TextButtonControl from "app/controls/button/TextButtonControl";
import ChoiceScene from "app/scenes/ChoiceScene";
import {promiseDelay} from "app/helpers/TimeHelper";
import {ScaleHelper} from "app/helpers/ScaleHelper";
import {Mesh} from "@pixi/mesh";
import {Geometry, RenderTexture, Shader} from "@pixi/core";
import {Container} from "@pixi/display";
import {inject} from "app/model/injection/InjectDecorator";

export default class ShaderAnimationScene extends BaseScene {
    @inject(FullScreenButtonControl)
    private fullScreenButton:FullScreenButtonControl = <any>{};
    private textButtonControl = new TextButtonControl("Back");
    private waveContainer:Container = new Container();
    private waveQuad:Mesh<Shader> = <any>{};
    private waveTexture:RenderTexture= <any>{};
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
        const vertexSrc = `
            precision mediump float;
            attribute vec2 aVertexPosition;
            attribute vec2 aUvs;
            uniform mat3 translationMatrix;
            uniform mat3 projectionMatrix;
            varying vec2 vUvs;
            
            void main() {
                vUvs = aUvs;
                gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            }
        `;
        const fragmentWaveSrc = `
            precision mediump float;
            varying vec2 vUvs;
            uniform float amplitude;
            uniform float time;
            
            void main()
            {
                vec2 uv = (vUvs-vec2(0.5))*2.0;
                vec3 outColor = vec3(0.);
                outColor += 5./length(uv.y*200. - 50.0*sin( uv.x*0.25+ time*0.25)*amplitude);
                outColor += 4./length(uv.y*300. - 100.0*sin(uv.x*0.5+time*0.5)*amplitude*1.2);
                outColor += 3./length(uv.y*400. - 150.0*sin(uv.x*0.75+time*0.75)*amplitude*1.4);
                outColor += 2./length(uv.y*500. - 200.0*sin(uv.x+time)*amplitude*1.6);
                gl_FragColor = vec4(outColor,1.0);
            }
        `;
        this.waveUniforms = {
            amplitude: 0.75,
            time: 0,
        };
        const waveShader = Shader.from(vertexSrc, fragmentWaveSrc, this.waveUniforms);
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