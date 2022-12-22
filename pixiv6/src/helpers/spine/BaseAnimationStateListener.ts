import {AnimationStateListener, IEvent, ITrackEntry, TrackEntry} from "@pixi-spine/all-4.0";

export abstract class BaseAnimationStateListener implements AnimationStateListener {
    start(entry: TrackEntry): void {}

    interrupt(entry: TrackEntry): void {}

    end(entry: TrackEntry): void {}

    dispose(entry: TrackEntry): void {}

    complete(entry: TrackEntry): void {}

    event(entry: ITrackEntry, event: IEvent): void {}
}