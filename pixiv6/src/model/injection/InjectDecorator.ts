import constructor from "app/model/ContructortTypes";
import {Composer, Disposer} from "app/scenes/model/Scene";

export function inject<T>(instanceToken:constructor<T>, init?:() => T, ctx?:any):any {
    return function (target:Composer & Disposer & {[key:string]:any}, propertyKey:string, descriptor:PropertyDescriptor):any {
        const compose = target.compose;
        const initF = target.init;
        target.compose = function () {
            this[propertyKey] = dependencyManager.resolve(instanceToken, init);
            compose.apply(this);
        };
        target.init = function () {
            this[propertyKey] = dependencyManager.resolve(instanceToken, init);
            initF.apply(this);
        };
        const dispose = target.dispose;
        target.dispose = function () {
            dispose.apply(this);
            delete this[propertyKey];
        };
    }
}

export class DependencyManager {
    //todo: should be not a map - instance;
    public readonly controls:Map<constructor<any>, any> = new Map();

    unload():this {
        this.controls.clear();
        return this;
    }

    register<K>(key:constructor<any>, instance:K):this {
        this.controls.set(key, instance);
        return this;
    }

    has<T>(key:constructor<T>):boolean {
        return this.controls.has(<any>key);
    }

    resolve<T>(key:constructor<T>, init?:() => T, ctx?:any):T {
        let instance = this.controls.get(<any>key);
        if (!instance) {
            if (init) {
                instance = ctx ? init.apply(ctx) : init();
                this.register(key, instance);
            } else {
                throw new Error(`key: ${key} is not defined.`);
            }
        }
        return <T>instance;
    }
}

let dependencyManager = new DependencyManager();
export default dependencyManager;