import ButtonControl, {ButtonControlOptions} from "app/controls/button/ButtonControl";
import {Container} from "@pixi/display";
import {Graphics} from "@pixi/graphics";
import {ITextStyle, Text} from "@pixi/text";
import {PivotType} from "app/controls/MainControl";
import gameModel, {GameSize} from "app/model/GameModel";
import {ScaleHelper} from "app/helpers/ScaleHelper";

/**
 * Primitive button container with text label
 */
export default class TextButtonControl extends ButtonControl {
    protected label:Text;
    protected graphics:Graphics;
    protected readonly opt:{paddingX:number; paddingY:number; radiusFactor:number; target:any; style:Partial<ITextStyle>} & ButtonControlOptions;
    constructor(text:string, opt?:{paddingX?:number, paddingY?:number, radiusFactor?:number, target?:any, style?:Partial<ITextStyle>} & ButtonControlOptions) {
        opt = opt ? opt : {};
        opt.paddingX = opt.paddingX === undefined ? 20 : opt.paddingX;
        opt.paddingY = opt.paddingY === undefined ? 20 : opt.paddingY;
        opt.radiusFactor = opt.radiusFactor === undefined ? 0.25 : opt.radiusFactor;
        opt.style = opt.style === undefined ? {} : opt.style;
        opt.align = opt.align?opt.align:PivotType.C;
        const container = new Container();
        const label = new Text(text, opt.style);
        let graphics = new Graphics();
        graphics.beginFill(0xcecece);
        graphics.drawRoundedRect(0, 0,
            label.width + opt.paddingX, label.height + opt.paddingY,
            Math.min(label.width, label.height) * opt.radiusFactor);
        graphics.endFill();
        container.addChild(graphics);
        container.addChild(label);
        label.anchor.set(0.5);
        label.position.set(
            graphics.width / 2,
            graphics.height / 2,
        );
        super(container, opt);
        this.label = label;
        this.graphics = graphics;
        this.opt = <any>opt;
        setTimeout(() => {
            gameModel.updateLayout.add(this.onResize, this, true);
        }, 1000);
        this.onResize(<any>{});
    }

    private onResize(data:GameSize) {
        const graphics = this.graphics;
        const label = this.label;
        const opt = this.opt;
        const width = this.container.width;
        const height = this.container.height;
        graphics.clear();
        graphics.beginFill(0xcecece);
        graphics.drawRoundedRect(0, 0,
            width, height,
            Math.min(width, height) * opt.radiusFactor);
        graphics.endFill();
        label.position.set(
            graphics.width / 2,
            graphics.height / 2,
        );
        ScaleHelper.scaleToSizeIn(this.label, {
            width:graphics.width - this.opt.paddingX,
            height:graphics.height - this.opt.paddingY
        });
        this.container.scale.set(1);
        console.log("Btn Layout update")
    }

    dispose() {
        gameModel.updateLayout.unload(this);
    }
}