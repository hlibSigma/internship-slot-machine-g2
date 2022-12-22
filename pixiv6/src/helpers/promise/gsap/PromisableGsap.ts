import gsap from "gsap";

class PromisableGsap {
    to(target:any, prop:GSAPTweenVars):Promise<any>{
        return new Promise(resolve => {
            gsap.to(target, {
                duration: 0.75,
                ...prop,
                onComplete: resolve,
            });
        });
    }
}
const pgsap = new PromisableGsap();
export default pgsap;