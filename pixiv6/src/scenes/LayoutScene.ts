import BaseScene from "app/scenes/BaseScene";
import {inject} from "app/model/injection/InjectDecorator";
import FullScreenButtonControl from "app/controls/button/FullScreenButtonControl";
import {getRect} from "app/helpers/GuiPrimitive";
import LayoutManager, {PartialLayout} from "app/layoutManager/LayoutManager";
import TextButtonControl from "app/controls/button/TextButtonControl";
import gameModel, {GameSize} from "app/model/GameModel";
import ChoiceScene from "app/scenes/ChoiceScene";
import {PivotType} from "app/controls/MainControl";
import {Text} from "@pixi/text";

export default class LayoutScene extends BaseScene {
    @inject(FullScreenButtonControl)
    private fullScreenButton:FullScreenButtonControl = <any>{};
    @inject(LayoutManager)
    private layoutManager:LayoutManager = <any>{};
    private textButtonControl = new TextButtonControl("Back", {align:PivotType.TL});
    private baseLayouts:PartialLayout[] = [{
        name:"item",
        uid:"item",
        height:"99%",
        width:"99%",
        top:"0.5%",
        left:"0.5%"
    },{
        name:"smallMiddleBox",
        uid:"smallMiddleBox",
        height:"80%",
        width:"80%",
        top:"10%",
        left:"10%",
    }];
    private sceneLayout:PartialLayout = {
        name:"body",
        extend:"smallMiddleBox",
        sortBy:"vertical",
        display:"relative",

        layouts:[
            {
                name:"topPanel",
                height:"10%",
                width:"99%",
                top:"0.5%",
                left:"0.5%",
                layouts:[
                    {
                        name:"backButton",
                        width: 100,
                        height: "80%",
                        top:"10%",
                        left:10,
                        scaleBy:"height"
                    },
                    {
                        name:"titleContainer",
                        width: "200%",
                        height: "100%",
                        left: "-50%",
                        scaleBy:"both",
                        alignIn:"c",
                        aspects:{
                            "3340/1920":{
                                width: "200%",
                                left: "-50%",
                            },
                            "1920/3340":{
                                width: "160%",
                                left: "-30%",
                            }
                        },
                        layouts: [{
                            name:"title",
                            width: "100%",
                            height: "100%",
                            scaleBy:"height",
                            alignIn:"c",

                            aspects:{
                                "1920/1935":{
                                    scaleBy:"height",
                                },
                                "1920/2050":{
                                    scaleBy:"width",
                                }
                            },
                        }]
                    },
                    {
                        name:"fsButton",
                        width: 100,
                        height: "80%",
                        left:-10,
                        scaleBy:"height",
                        align:"r",
                        alignIn:"r"
                    }
                ]
            },
            {
                name:"bottomBody",
                height:"99%",
                width:"99%",
                top:"0.5%",
                left:"0.5%",
                layouts:[
                    {
                        name:"column1",
                        extend:"smallMiddleBox",
                        sortBy:"horizontal",
                        aspects:{
                            "1920/1080":{
                                sortBy:"horizontal",
                            },
                            "1920/1935":{
                                sortBy:"horizontal",
                            },
                            "1920/2050":{
                                sortBy:"vertical",
                            }
                        },
                        layouts:[
                            {
                                name:"item1",
                                extend:"item",
                            },
                            {
                                name:"item2",
                                extend:"item",
                            },
                            {
                                name:"item3",
                                extend:"item",
                            },
                            {
                                name:"item4",
                                extend:"item",
                            }
                        ]
                    },
                    {
                        name:"column2",
                        height:"90%",
                        width:"90%",
                        top:"5%",
                        left:"-5%",
                    },
                    {
                        name:"column3",
                        height:"90%",
                        width:"90%",
                        top:"5%",
                        left:"15%",
                    },
                    {
                        name:"column4",
                        extend:"smallMiddleBox",
                    }
                ]
            }

        ]
    };

    compose():void {
        this.textButtonControl.onClick.add(() => {
            gameModel.getHowler().play("btn_click");
            this.sceneManager.navigate(ChoiceScene);
        }, this);
        this.textButtonControl.container.name = "backButton";
    }

    activate() {
        super.activate();
        this.fullScreenButton.container.name = "fsButton";
        const title = new Text("Layout Scene", {
            fontSize:320,
            fill: "#e6d1d1",
            stroke: "#411f1f",
            strokeThickness: 20,
        });
        this.scene.addChild(title).name = "title";
        this.scene.addChild(getRect(100, 100, 0x0000ff, 0.2)).name = "titleContainer";
        this.scene.addChild(getRect(100, 100, 0x0000ff, 0.2)).name = "column1";
        this.scene.addChild(getRect(100, 100, 0x0000aa, 0.2)).name = "column2";
        this.scene.addChild(getRect(100, 100, 0x000055, 0.2)).name = "column3";
        this.scene.addChild(getRect(100, 100, 0x000000, 0.2)).name = "column4";
        this.scene.addChild(getRect(100, 100, 0xffff00, 0.5)).name = "item1";
        this.scene.addChild(getRect(100, 100, 0xaaff00, 0.5)).name = "item2";
        this.scene.addChild(getRect(100, 100, 0x55ff00, 0.5)).name = "item3";
        this.scene.addChild(getRect(100, 100, 0x00ff00, 0.5)).name = "item4";
        this.scene.addChild(getRect(100, 100, 0xcecece, 0.2)).name = "bottomBody";
        this.scene.addChild(getRect(100, 100, 0xaaffaa, 0.2)).name = "topPanel";
        this.addControl(this.fullScreenButton);
        this.addControl(this.textButtonControl);
        this.layoutManager.addLayout(...this.baseLayouts);
        this.layoutManager.addLayout(this.sceneLayout);
    }

    protected onResize(gameSize:GameSize) {
        super.onResize(gameSize);
        this.fullScreenButton.container.x = gameSize.width * .9;
        this.fullScreenButton.container.y = gameSize.height * .13;
        this.textButtonControl.container.position.set(
            gameSize.width * .1,
            gameSize.height * .1
        );
    }

    deactivate() {
        super.deactivate();
        this.layoutManager.removeLayout(this.sceneLayout);
        this.layoutManager.removeLayout(...this.baseLayouts);
    }

}