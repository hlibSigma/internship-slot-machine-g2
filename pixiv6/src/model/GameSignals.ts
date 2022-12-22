import Signal from "app/helpers/signals/signal/Signal";
import {TFullUserData, TInitResponse, TResponse, TSpinResponse} from "app/server/fruit/service/typing";

export default class GameSignals {
    public readonly reels = {
        updateSkin: new Signal<string>(),
        updateAnimation: new Signal<string>(),
        spin: new Signal<void>(),
        stop: new Signal<number[]>(),
    };
    public readonly betChanged = new Signal<number>();
    public readonly spinComplete = new Signal<void>();
    public readonly spinStarted = new Signal<void>();
    public readonly data = {
        login: new Signal<TInitResponse>(),
        spin: new Signal<TSpinResponse>(),
        users: new Signal<TFullUserData[]>(),
        stopReel: new Signal<TResponse>(),
        buyAmount: new Signal<TResponse>(),
    };
}