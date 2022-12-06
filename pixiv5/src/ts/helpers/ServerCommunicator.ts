import getStringPromise from "./PromiseHelper";

export default class ServerCommunicator {
    private readonly serverHost:string

    constructor(serverHost:string | null = null) {
        if (serverHost) {
            this.serverHost = serverHost;
        } else {
            this.serverHost = window.location.origin;
        }
    }

    submit(action:string, data:any = null, post:boolean = true):Promise<string> {
        if (!data) {
            data = {};
        }
        let http = new XMLHttpRequest();
        let method = post ? "POST" : "GET";
        let promise = getStringPromise();
        http.open(method, this.serverHost + action, true);
        http.setRequestHeader("Content-type", "application/json; charset=utf-8");
        http.withCredentials = true;
        http.send(JSON.stringify(data));

        function getStatus(ev:ProgressEvent<EventTarget>) {
            return (<any>ev.target).status;
        }

        http.onerror = ev => {
            promise.rejector("Error " + getStatus(ev) + " occurred while receiving the document.");
        }
        http.onabort = ev => {
            promise.rejector("Abort " + getStatus(ev) + " occurred while receiving the document.");
        }
        http.onload = function () {
            if ([405, 400].indexOf(http.status) >= 0) {
                promise.rejector(http.status);
            } else {
                promise.resolver(http.responseText);
            }
        };
        return promise.p;
    }

    static get(action:string, root:string | null = null):Promise<string> {
        return new ServerCommunicator(root).submit(action, {}, false);
    }
}