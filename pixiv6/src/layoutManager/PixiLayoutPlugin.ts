import {Layout, LayoutPlugin} from "app/layoutManager/LayoutManager";
import {Container, DisplayObject} from "@pixi/display";
import {ScaleHelper} from "app/helpers/ScaleHelper";

export default class PixiLayoutPlugin implements LayoutPlugin {
    private layoutElements:Map<string, DisplayObject[]> = new Map();

    constructor(protected stage:Container) {
    }

    update(layout:Layout):void {
        const displayObjects = <Container[]>this.layoutElements.get(layout.name);
        if (displayObjects) {
            displayObjects.forEach(displayObject => {
                switch (layout.scaleBy) {
                    case "width":
                        displayObject.width = layout.finalLayout.width;
                        displayObject.scale.y = displayObject.scale.x;
                        break;
                    case "height":
                        displayObject.height = layout.finalLayout.height;
                        displayObject.scale.x = displayObject.scale.y;
                        break;
                    case "fit.in":
                        ScaleHelper.scaleToSizeIn(displayObject, layout.finalLayout);
                        break;
                    case "fit.out":
                        ScaleHelper.scaleToSize(displayObject, layout.finalLayout);
                        break;
                    case "both":
                        displayObject.width = layout.finalLayout.width;
                        displayObject.height = layout.finalLayout.height;
                        break;
                }
                displayObject.position.x = layout.finalLayout.x;
                displayObject.position.y = layout.finalLayout.y;
                switch (layout.alignIn) {
                    case "r":
                    case "tr":
                    case "br":
                        displayObject.position.x = layout.finalLayout.x + layout.finalLayout.width - displayObject.height;
                        break;
                    case "l":
                    case "bl":
                    case "tl":
                        displayObject.position.x = layout.finalLayout.x;
                        break;
                    case "c":
                    case "b":
                    case "t":
                        displayObject.position.x = layout.finalLayout.x + (layout.finalLayout.width - displayObject.width) / 2;
                        break;


                }
                switch (layout.alignIn) {
                    case "t":
                    case "tr":
                    case "tl":
                        displayObject.position.y = layout.finalLayout.y;
                        break;
                    case "b":
                    case "br":
                    case "bl":
                        displayObject.position.y = layout.finalLayout.y + (layout.finalLayout.height - displayObject.height);

                        break;
                    case "c":
                    case "r":
                    case "l":
                        displayObject.position.y = layout.finalLayout.y + (layout.finalLayout.height - displayObject.height) / 2;
                        break;
                }
            });
        }
        layout.layouts.forEach(value => {
            this.update(value);
        });
    }

    beforeUpdate():void {
        this.layoutElements.clear();
        this.findAndUpdate();
    }

    private findAndUpdate(root:Container | null = null) {
        root = root ? root : this.stage;
        root.children.forEach(value => {
            if (value.name) {
                if(!this.layoutElements.has(value.name)){
                    this.layoutElements.set(value.name, []);
                }
                this.layoutElements.get(value.name)!.push(value);
            }
            if (value instanceof Container) {
                this.findAndUpdate(value);
            }
        })
    }

    afterUpdate():void {}

    dispose():void {

    }

}