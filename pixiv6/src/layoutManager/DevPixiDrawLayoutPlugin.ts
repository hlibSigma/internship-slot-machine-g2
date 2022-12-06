import {Layout, LayoutPlugin} from "app/layoutManager/LayoutManager";
import {Graphics} from "@pixi/graphics";
import {Container} from "@pixi/display";

export default class DevPixiDrawLayoutPlugin implements LayoutPlugin {
    private graphics:Graphics;

    constructor(protected stage:Container) {
        this.graphics = new Graphics();
    }

    update(layout:Layout):void {
        const graphics = this.graphics;
        graphics.lineStyle(5, 0xff0000, .5);
        if(layout.uid == ""){
            this.drawLayout(layout);
        }
    }

    beforeUpdate():void {
        const graphics = this.graphics;
        this.stage.addChild(graphics);
        graphics.clear();
    }

    afterUpdate():void {}

    private drawLayout(layout:Layout) {
        const graphics = this.graphics;
        graphics.drawRect(
            layout.finalLayout.x,
            layout.finalLayout.y,
            layout.finalLayout.width,
            layout.finalLayout.height
        );
        layout.layouts.forEach(value => {
            this.drawLayout(value);
        });

    }

    dispose():void {
        this.graphics.clear();
    }
}