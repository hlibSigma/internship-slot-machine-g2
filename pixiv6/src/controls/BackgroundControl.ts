import MainControl from "./MainControl";
import gameModel, {GameSize} from "../model/GameModel";
import {ScaleHelper} from "app/helpers/ScaleHelper";
import {Texture} from "@pixi/core";
import {Sprite} from "@pixi/sprite";
import TweenMax from "gsap";
import { getRandomSign } from "app/helpers/math";

export default class BackgroundControl extends MainControl {
    sprite: Sprite;

    constructor(texture?:Texture, private readonly overSize = 0) {
        super();
        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5, 0.5);
        this.container.addChild(this.sprite);
        gameModel.updateLayout.add((gameSize:GameSize, resolve?:()=>void) => {
            ScaleHelper.scaleToSize(this.container, {
                width: gameSize.width + overSize,
                height: gameSize.height + overSize,
            });

            this.container.position.set(
                gameSize.width * 0.5,
                gameSize.height * 0.5
            );
            resolve!();
        }, this);
    }

    shake(duration = 0.1) {
        const random = this.overSize / 10 * getRandomSign();

        TweenMax.to(this.container, duration, {
            x: `+=${random}`,
            yoyo: true,
            repeat: 1,
        });
    };
}

