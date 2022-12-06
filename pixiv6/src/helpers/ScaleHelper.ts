import {Container} from "@pixi/display";
import {Text} from "@pixi/text";

export class ScaleHelper {

    public static scaleFontToFit(parentObject:Container, label:Text, padding:number):void {
        const scale = Math.min(
            1,
            Math.min((parentObject.width - padding) / label.width, (parentObject.height - padding) / label.height)
        );
        label.style.fontSize = Number(label.style.fontSize) * scale;
    }

    public static scaleFontToFitWidth(width:number, label:Text):void {
        const scale = Math.min(1, Math.min(width / label.width));
        label.style.fontSize = Number(label.style.fontSize) * scale;
    }

    public static scaleToHeight(container:Container, height:number) {
        container.scale.set(1);
        const scale = Math.min(1, height / container.height);
        container.scale.set(scale);
    }

    public static scaleToWidth(container:Container, width:number) {
        container.scale.set(1);
        const scale = Math.min(1, width / container.width);
        container.scale.set(scale);
    }

    static scaleToSize(pixiContainer:Container, size:{width:number, height:number}) {
        pixiContainer.scale.set(1);
        const width = size.width;
        const height = size.height;
        const scale = Math.max(
            width / pixiContainer.width,
            height / pixiContainer.height
        );
        pixiContainer.scale.set(scale);
    }

    static scaleToSizeIn(pixiContainer:Container, size:{width:number, height:number}) {
        pixiContainer.scale.set(1);
        const width = size.width;
        const height = size.height;
        const scale = Math.min(
            width / pixiContainer.width,
            height / pixiContainer.height
        );
        pixiContainer.scale.set(scale);
    }

    static scaleToContainerFit(pixiContainer:Container, pixiContainerToFit:Container) {
        pixiContainer.scale.set(1);
        const width = pixiContainerToFit.width;
        const height = pixiContainerToFit.height;
        const scale = Math.max(
            width / pixiContainer.width,
            height / pixiContainer.height
        );
        pixiContainer.scale.set(scale);
    }
}
