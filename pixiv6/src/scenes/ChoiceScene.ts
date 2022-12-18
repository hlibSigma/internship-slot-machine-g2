import BaseScene from "./BaseScene";
import BackgroundControl from "../controls/BackgroundControl";
import gameModel from "../model/GameModel";
import FullScreenButtonControl from "app/controls/button/FullScreenButtonControl";
import SpineScene from "app/scenes/SpineScene";
import AlphaFadeInEffect from "app/pixi/effects/AlphaFadeInEffect";
import DevAnimationScene from "app/scenes/DevAnimationScene";
import GsapDevAnimationScene from "app/scenes/GsapDevAnimationScene";
import ShaderAnimationScene from "app/scenes/ShaderAnimationScene";
import TextButtonControl from "app/controls/button/TextButtonControl";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";
import ButtonControl from "app/controls/button/ButtonControl";
import FragShaderAnimationScene from "app/scenes/FragShaderAnimationScene";
import {ITextStyle} from "@pixi/text";
import FontScene from "app/scenes/FontScene";
import {inject} from "app/model/injection/InjectDecorator";
import LayoutScene from "app/scenes/LayoutScene";
import LayoutManager from "app/layoutManager/LayoutManager";
import {PivotType} from "app/controls/MainControl";
import choiceSceneLayout from "app/scenes/ChoiceScene.layout";
import SpineControlScene from "app/scenes/SpineControlScene";
import GameScene from "app/scenes/GameScene";
import GPacmanScene from "app/scenes/GPacmanScene";
import OS_GameScene from "app/scenes/OS/GameScene";
import SymbolsScene from "app/scenes/SymbolsScene";
import SlotMachineScene from "app/scenes/SlotMachineScene";
import MS_PANEL from "./MS_Panel";

export default class ChoiceScene extends BaseScene {
    @inject(FullScreenButtonControl, ChoiceScene.createFullScreenButton)
    public fullScreenButton:FullScreenButtonControl = <any>{};
    @inject(LayoutManager)
    private layoutManager:LayoutManager = <any>{};

    private style:Partial<ITextStyle> = {
        fontFamily: "Arial",
        letterSpacing: 2,
        fontSize: 24,
        align: "center",
    };
    protected buttons = [
        new TextButtonControl("Game\nExample", {target: GameScene, style: this.style, align:PivotType.TL}).name("item1_1"),
        new TextButtonControl("Spine\nscene", {target: SpineScene, style: this.style, align:PivotType.TL}).name("item1_2"),
        new TextButtonControl("Spine\ncontrol\nscene", {target: SpineControlScene, style: this.style, align:PivotType.TL}).name("item2_1"),
        new TextButtonControl("Shader\nscene", {target: ShaderAnimationScene, style: this.style, align:PivotType.TL}).name("item2_2"),
        new TextButtonControl("FragShader\nscene", {target: FragShaderAnimationScene, style: this.style, align:PivotType.TL}).name("item3_1"),
        new TextButtonControl("Font\nScene", {target: FontScene, style: this.style, align:PivotType.TL}).name("item3_2"),
        new TextButtonControl("Layout\nScene", {target: LayoutScene, style: this.style, align:PivotType.TL}).name("item4_1"),
        new TextButtonControl("Dev\nanimation\nscene", {target: DevAnimationScene, style: this.style, align:PivotType.TL}).name("item4_2"),
        new TextButtonControl("Gsap\nanimation\nscene", {target: GsapDevAnimationScene, style: this.style, align:PivotType.TL}).name("item4_3"),
        new TextButtonControl("OS_Pacman", {target: OS_GameScene, style: this.style, align:PivotType.TL}).name("item5_1"),
        new TextButtonControl("MS_Pacman", {target: GsapDevAnimationScene, style: this.style, align:PivotType.TL}).name("item5_2"),
        new TextButtonControl("MS_PANEL", {target: MS_PANEL, style: this.style, align:PivotType.TL}).name("item3_3"),
        new TextButtonControl("GPacman", {target: GPacmanScene, style: this.style,align: PivotType.TL}).name("item5_3"),
        new TextButtonControl("Slot\nMachine", {target: SlotMachineScene, style: this.style, align:PivotType.TL}).name("item6_1"),
        new TextButtonControl("Spine\nsymbols", {target: SymbolsScene, style: this.style, align:PivotType.TL}).name("item6_2"),
    ];

    compose():void {
        gameModel.resolve(BackgroundControl, this.createBackground, this);
        this.buttons.forEach(value => value.onClick.add(this.onButtonClick, this));
    }

    activate():void {
        super.activate();
        const backgroundControl:BackgroundControl = gameModel.resolve(BackgroundControl);
        this.addControl(backgroundControl);
        this.addControl(this.fullScreenButton);
        this.buttons.forEach(value => this.addControl(value));
        this.layoutManager.addLayout(...choiceSceneLayout.baseLayouts);
        this.layoutManager.addLayout(choiceSceneLayout.sceneLayout);
    }

    deactivate() {
        super.deactivate();
        this.layoutManager.removeLayout(choiceSceneLayout.sceneLayout);
        this.layoutManager.removeLayout(...choiceSceneLayout.baseLayouts);
    }

    protected static createFullScreenButton():FullScreenButtonControl {
        let buttonControl = new FullScreenButtonControl(document.body, 0xffffff);
        buttonControl.onClick.add(_ => {
            let soundId = gameModel.getHowler().play("grass_step");
            gameModel.getHowler().volume(0.25, soundId);
        });
        buttonControl.name("fsButton");
        return buttonControl;
    }

    protected createBackground():BackgroundControl {
        let texture = StrictResourcesHelper.getTexture("UI", "game_bg.png");
        let backgroundControl = new BackgroundControl(texture);
        new AlphaFadeInEffect(backgroundControl.container, this.app.ticker);
        return backgroundControl;
    }

    protected onButtonClick(button:ButtonControl) {
        this.sceneManager.navigate(button.target);
        gameModel.getHowler().play("btn_click");
    }
}