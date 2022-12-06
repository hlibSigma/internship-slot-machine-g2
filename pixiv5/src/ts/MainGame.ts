import FontFaceLoader from "./helpers/FontFaceLoader";
import gameModel from "./model/GameModel";
import {Main} from "./Main";
import LoaderScene from "./scenes/LoaderScene";

window.onload = function () {
    let fontFaceLoader = new FontFaceLoader('FredokaOne-Regular', 'assets/fonts/FredokaOne-Regular.ttf');
    let promise = gameModel.initHowler();
    let stringPromise = fontFaceLoader.load();
    Promise.all([promise, stringPromise]).then(() => {
        new Main(LoaderScene);
    }).catch(reason => {
        console.error(reason);
    });
}