// todo: need to make it more for samples
class PortalExample {
    private selectSkinElement:HTMLSelectElement;
    private selectHueElement:HTMLSelectElement;
    private gameFrame:HTMLIFrameElement;

    constructor() {
        this.selectSkinElement = <any>document.getElementById("select-skin");
        this.selectHueElement = <any>document.getElementById("select-hue");
        this.gameFrame = <any>document.getElementById("gameFrame");
        for (let i = 0; i < 360; i += 10) {
            let optionElement = document.createElement("option");
            optionElement.value = i + "";
            optionElement.innerHTML = i + "";
            this.selectHueElement.appendChild(optionElement);
        }
        this.selectSkinElement.addEventListener("change", this.updateGame.bind(this));
        this.selectHueElement.addEventListener("change", this.updateGame.bind(this));
        this.updateGame();
    }

    private updateGame() {
        let value = this.selectSkinElement.options[this.selectSkinElement.selectedIndex].value;
        this.gameFrame.src = this.getGameUrl(value);
    }

    private getGameUrl(value:string) {
        let images1 = [1, 2, 3, 4, 1, 2, 3, 4, 1];
        let images2 = [1, 1, 1, 2, 2, 2, 3, 3, 3];
        let images3 = [1, 1, 2, 2, 3, 3, 4, 4, 1];
        let images4 = [1, 1, 1, 1, 3, 3, 3, 3, 3];
        let url = "./game_index.html?";
        switch (value) {
            case "0":
                url += this.getUrlWithIcons(images1);
                url += "&title=INITIAL GAME";
                url += "&bg=assets/images/game_bg.png";
                break;
            case "1":
                url += this.getUrlWithIcons(images1);
                url += "&title=INITIAL GAME";
                url += "&bg=assets/images/game_bg_1.jpg";
                break;
            case "2":
                url += this.getUrlWithIcons(images2);
                url += "&title=CUSTOM GAME";
                url += "&bg=assets/images/game_bg_2.jpg";
                break;
            case "3":
                url += this.getUrlWithIcons(images3);
                url += "&title=UTY PUTTY GAME";
                url += "&bg=assets/images/game_bg_3.jpg";
                break;
            case "4":
                url += this.getUrlWithIcons(images4);
                url += "&title=GAME WITH EXTERNAL BG";
                url += "&bg=https://images.pexels.com/photos/1672453/pexels-photo-1672453.png";
                break;
        }
        url += `&hue=${this.selectHueElement.options[this.selectHueElement.selectedIndex].value}`;
        return url;
    }

    private getUrlWithIcons(images:number[]) {
        return images.map((value, index) => {
            return `p${index + 1}=assets/images/symbols/${value}.png`
        }).join("&");
    }
}

window.onload = function () {
    new PortalExample();
}