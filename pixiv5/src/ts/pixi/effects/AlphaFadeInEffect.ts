import {Container, Ticker} from "pixi.js";

export default class AlphaFadeInEffect {

    constructor(container:Container, ticker:Ticker) {
        container.alpha = 0;
        let effectRender = () => {
            container.alpha += (1 - container.alpha) * .25;
            if (container.alpha > 1) {
                container.alpha = 1;
                ticker.remove(effectRender);
            }
        };
        ticker.add(effectRender)
    }
}