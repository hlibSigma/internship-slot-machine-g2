export type PromiseData = {
    resolver: any,
    rejector: any,
    p: Promise<any>
}

export function getPromiseMapper<T, R>(promise: Promise<T>, mapFunction: (r: T) => R): Promise<R> {
    return new Promise<R>((resolve: (r: R) => void) => {
        promise.then((v: T) => {
            resolve(mapFunction(v));
        });
    });
}

export function getPromiseWithAnswer(answer: string): Promise<string> {
    return new Promise<string>((resolve: (r: string) => void) => {
        resolve("answer");
    });
}

export default function getStringPromise(): PromiseData {
    let resolver: (r: string) => void = () => {
    };
    let rejector: (r: string) => void = () => {
    };
    let p = new Promise((resolve: (value: string) => void, reject: (reason: string) => void) => {
        resolver = resolve;
        rejector = reject;
    });
    return {resolver, rejector, p};
}