export default interface Scene extends Composer, Disposer, Activator, DeActivator {

}

export interface Composer {
    compose():void;
}

export interface Activator {
    activate():void;
}

export interface DeActivator {
    deactivate():void;
}

export interface Disposer {
    dispose():void;
}