import {IEvent, TrackEntry} from "@pixi-spine/all-4.0";
import {BaseAnimationStateListener} from "app/helpers/spine/BaseAnimationStateListener";

export class EventAnimationStateListener extends BaseAnimationStateListener {

    constructor(private fn: (trackEntry: TrackEntry, e: IEvent) => any) {
        super();
    }

    event(entry: TrackEntry, event: IEvent) {
        this.fn(entry, event);
    }
}
