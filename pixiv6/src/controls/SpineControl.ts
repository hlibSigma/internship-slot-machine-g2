import MainControl from "app/controls/MainControl";
import SpineLoader from "app/loader/SpineLoader";
import {Spine} from "@pixi-spine/all-4.0";
import {Ticker} from "@pixi/ticker";
import {inject} from "app/model/injection/InjectDecorator";

export default class SpineControl extends MainControl {
    private spine:Spine;
    @inject(Ticker)
    public ticker:Ticker = <any>{};

    constructor(spineKey:string) {
        super(SpineLoader.getSpine(spineKey));
        this.spine = <Spine>this.container;
    }

    setSkin(name:string) {
        this.spine.skeleton.setSkinByName(name);
    }

    play(name:string, data?:{trackIndex?:number, loop?:boolean}) {
        data = data ?? {};
        data.trackIndex = data?.trackIndex ?? 0;
        data.loop = data?.loop ?? false;
        this.spine.state.setAnimation(
            data.trackIndex, name, data.loop
        );
        this.ticker.add(this.update, this);
    }

    private update(dt:number) {
        this.spine.update(((1000 / 60) / 1000) * dt);
    }

    dispose() {
        super.dispose();
        this.ticker.remove(this.update, this);
    }
}