import {CompleteAnimationStateListener} from "app/helpers/spine/CompleteAnimationStateListener";
import {EventAnimationStateListener} from "app/helpers/spine/EventAnimationStateListener";
import {IEvent, TrackEntry} from "@pixi-spine/all-4.0";
import {AnimationEndStateListener} from "app/helpers/spine/AnimationEndStateListener";

export default new class SpineStateListenerFactory {
    complete(fn: (entry: TrackEntry) => any) {
        return new CompleteAnimationStateListener(fn);
    }

    event(fn: (ctx: TrackEntry, e: IEvent) => any) {
        return new EventAnimationStateListener(fn);
    }

    end(fn: (entry: TrackEntry) => any) {
        return new AnimationEndStateListener(fn);
    }
}();

