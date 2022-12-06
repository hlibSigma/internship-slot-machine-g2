export function promiseDelay(delay:number) {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
}