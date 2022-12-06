import MainControl from "./MainControl";
import {Graphics} from "pixi.js";
import {getRect} from "../helpers/GuiPrimitive";
// todo: need to add animation as in youtube;
export default class FullScreenButtonControl extends MainControl {
    private readonly corner1:PIXI.Graphics;
    private readonly corner2:PIXI.Graphics;
    private readonly corner3:PIXI.Graphics;
    private readonly corner4:PIXI.Graphics;
    private _center: number;
    private _htmlElement: HTMLElement;

    constructor(htmlElement:HTMLElement, color:number, weight:number = 5) {
        super();
        this._htmlElement = htmlElement;
        let cornerSize = weight * 3;
        //todo: need to check. why it works without padding;
        let cornerPadding = 0;//weight / 4;
        this._center = cornerSize + cornerPadding;

        let box = getRect(this._center * 3, this._center * 3, 0xff0000, 0);
        this.corner1 = new Graphics();
        this.corner1.lineStyle(weight, color);
        this.corner1.moveTo(0, cornerSize)
        this.corner1.lineTo(0, 0)
        this.corner1.lineTo(cornerSize, 0);
        this.corner2 = new Graphics();
        this.corner2.lineStyle(weight, color);
        this.corner2.moveTo(0, 0)
        this.corner2.lineTo(cornerSize, 0);
        this.corner2.lineTo(cornerSize, cornerSize)
        this.corner3 = new Graphics();
        this.corner3.lineStyle(weight, color);
        this.corner3.moveTo(cornerSize, 0)
        this.corner3.lineTo(cornerSize, cornerSize)
        this.corner3.lineTo(0, cornerSize);
        this.corner4 = new Graphics();
        this.corner4.lineStyle(weight, color);
        this.corner4.moveTo(0, 0)
        this.corner4.lineTo(0, cornerSize)
        this.corner4.lineTo(cornerSize, cornerSize);

        this.enterNoFullScreenState(this._center);

        box.pivot.set(this._center, this._center);

        this.container.addChild(
            this.corner1,
            this.corner2,
            this.corner3,
            this.corner4,
            box
        );

        this.container.interactive = true;
        this.container.buttonMode = true;

        const onFullscreenChange = () => {
            if(this.isFullscreen()) {
                this.enterFullscreenState(this._center);
            } else {
                this.enterNoFullScreenState(this._center);
            }
        };


        /* Standard syntax */
        document.addEventListener('fullscreenchange', onFullscreenChange);
        /* Firefox */
        document.addEventListener('mozfullscreenchange', onFullscreenChange);
        /* Chrome, Safari and Opera */
        document.addEventListener('webkitfullscreenchange', onFullscreenChange);
        /* IE / Edge */
        document.addEventListener('msfullscreenchange', onFullscreenChange);

        this.container.on("pointerup", () => {
            if (this.isFullscreen()) {
                this.offFullScreen();
            } else {
                this.onFullScreen(htmlElement);
            }
        });
    }

    private onFullScreen(htmlElement: HTMLElement):void {
        if (!htmlElement) {
            return;
        }
        const el = htmlElement.parentElement as HTMLElementWithAllFSRequests;
        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.mozRequestFullScreen) {
            /* Firefox */
            el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
            /* IE/Edge */
            el.msRequestFullscreen();
        }
    }

    private offFullScreen():void {
        const doc = document as DocWithAllFSExitRequests;
        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            /* Firefox */
            doc.mozCancelFullScreen();
        } else if (doc.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            doc.webkitExitFullscreen();
        } else if (doc.msExitFullscreen) {
            /* IE/Edge */
            doc.msExitFullscreen();
        }
    }

    public isFullscreen():boolean {
        const doc = document as AllFullscreenElements;
        return !!(
            doc.webkitFullscreenElement ||
            doc.mozFullScreenElement ||
            doc.webkitCurrentFullScreenElement ||
            doc.fullscreenElement
        );
    }

    private enterNoFullScreenState(center:number) {
        this.corner1.pivot.set(center, center);
        this.corner2.pivot.set(-center, center);
        this.corner3.pivot.set(-center, -center);
        this.corner4.pivot.set(center, -center);
    }

    private enterFullscreenState(center:number) {
        this.corner1.pivot.set(-center, -center);
        this.corner2.pivot.set(+center, -center);
        this.corner3.pivot.set(+center, +center);
        this.corner4.pivot.set(-center, +center);
    }

};

type HTMLElementWithAllFSRequests = HTMLElement & {
    mozRequestFullScreen(): Promise<void>;
    webkitRequestFullscreen(): Promise<void>;
    msRequestFullscreen(): Promise<void>;
};

type DocWithAllFSExitRequests = Document & {
    mozCancelFullScreen(): Promise<void>;
    webkitExitFullscreen(): Promise<void>;
    msExitFullscreen(): Promise<void>;
};

type AllFullscreenElements = Document & {
    webkitFullscreenElement: Element;
    webkitCurrentFullScreenElement: Element;
    mozFullScreenElement: Element;
};
