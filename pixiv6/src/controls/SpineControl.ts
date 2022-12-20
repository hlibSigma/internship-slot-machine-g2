import MainControl from "app/controls/MainControl";
import SpineLoader from "app/loader/SpineLoader";
import {Spine} from "@pixi-spine/all-4.0";
import {Ticker} from "@pixi/ticker";
import {inject} from "app/model/injection/InjectDecorator";
import SpineStateListenerFactory from "app/helpers/spine/SpineStateListenerFactory";
import promiseHelper from "app/helpers/promise/ResolvablePromise";

export default class SpineControl extends MainControl {
    public readonly spine: Spine;
    @inject(Ticker)
    public ticker: Ticker = <any>{};

    constructor(spineKey: string) {
        super(SpineLoader.getSpine(spineKey));
        this.spine = <Spine>this.container;
    }

    setSkin(name: string) {
        this.spine.skeleton.setSkinByName(name);
    }

    play(name: string, data?: {trackIndex?: number, loop?: boolean, loopsLimit?: number}) {
        data = data ?? {};
        data.trackIndex = data?.trackIndex ?? 0;
        data.loop = data?.loop ?? false;
        let loopsLimit = data?.loopsLimit ?? -1;
        const resolvablePromise = promiseHelper.getResolvablePromise<void>();
        const trackEntry = this.spine.state.setAnimation(
            data.trackIndex, name, data.loop
        );
        console.log(`Animation[${this.uid}] ${name} start, loop(${data?.loop})`)
        trackEntry.listener = SpineStateListenerFactory.complete(() => {
            if (loopsLimit-- < 0) {
                this.ticker.remove(this.update, this);
                resolvablePromise.resolve();
                console.log(`Animation[${this.uid}] ${name} end, loop(${data?.loop})`)
            }
        });
        this.ticker.remove(this.update, this);
        this.ticker.add(this.update, this);
        return resolvablePromise;
    }

    private update(dt: number) {
        this.spine.update(((1000 / 60) / 1000) * dt);
    }

    dispose() {
        super.dispose();
        this.ticker.remove(this.update, this);
    }
}