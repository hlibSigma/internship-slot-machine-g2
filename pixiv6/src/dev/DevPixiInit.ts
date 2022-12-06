import {Application} from "@pixi/app";
import {gameSize} from "app/Main";
import {Loader} from "@pixi/loaders";
import {Renderer} from "@pixi/core";
import {Container} from "@pixi/display";
import * as PIXI from 'pixi.js'

export function devPixiInit(){
    let app = new Application({
        width: gameSize.width,
        height: gameSize.height,
        backgroundColor: 0x000000,
        transparent: true
    });
    const target = {
        VERSION:"6.2.1",
        Application,
        Loader,
        Renderer,
        Container,
        app:app,
        stage:app.stage,

    };

    if(__DEV__){
        // import * as PIXI from 'pixi.js'
        // req
        const proxy1 = new Proxy(PIXI, {
            set(target:{VERSION:string}, p:string | symbol, value:any, receiver:any):boolean {
                console.log(`set:p:${p.toString()}, value: ${value}`);
                // @ts-ignore
                return Reflect.get(...arguments);
            },
            get(target:{}, p:string | symbol, receiver:any):any {
                console.log(`get:p:${p.toString()}`);
                // @ts-ignore
                return Reflect.get(...arguments);
            },
            has(target:{VERSION:string}, p:string | symbol):boolean {
                console.log(`has:p:${p.toString()}`);
                // @ts-ignore
                return Reflect.get(...arguments);
            },
            ownKeys(target:{}):ArrayLike<string | symbol> {
                console.log(`ownKeys:p:ownKeys}`);
                // @ts-ignore
                return Reflect.get(...arguments);
            },
            defineProperty(target:{VERSION:string}, p:string | symbol, attributes:PropertyDescriptor):boolean {
                console.log(`defineProperty:p:${p.toString()}`);
                // @ts-ignore
                return Reflect.get(...arguments);
            },
            apply(target:{VERSION:string}, thisArg:any, argArray:any[]):any {
                console.log(`apply:p:${thisArg}, ${argArray}`);
                // @ts-ignore
                return Reflect.get(...arguments);
            },
            construct(target:{VERSION:string}, argArray:any[], newTarget:Function):object {
                console.log(`proxy  construct`);
                // @ts-ignore
                return Reflect.get(...arguments);
            },
            isExtensible(target:{VERSION:string}):boolean {
                console.log(`proxy  isExtensible`);
                // @ts-ignore
                return Reflect.get(...arguments);
            }
        });
        // @ts-ignore
        window.PIXI = PIXI;
        (<any>window).__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
        (<any>window).__PIXI_INSPECTOR_GLOBAL_HOOK__.register({
            PIXI: proxy1,
        });
    }
    return app
}