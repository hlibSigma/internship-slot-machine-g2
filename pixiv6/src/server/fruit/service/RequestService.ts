import {TFullUserData, TInitResponse, TResponse, TSpinResponse} from "./typing";

export default class RequestService {

    protected readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async login(username: string): Promise<TInitResponse> {
        const url = `${this.baseUrl}user/login/?login=${username}`;
        console.log(`fetch(${url})`);
        const result = await fetch(url);
        const response: TInitResponse = JSON.parse(await result.text());
        console.log(response);
        return response;
    }

    async spin(betId: number): Promise<TSpinResponse> {
        const url = `${this.baseUrl}game/spin/?bet_id=${betId}`;
        console.log(`fetch(${url})`);
        const result = await fetch(url);
        const response: TSpinResponse = JSON.parse(await result.text());
        console.log(response);
        return response;
    }

    async getAllUsers(): Promise<TFullUserData[]> {
        const url = `${this.baseUrl}user/all/`;
        console.log(`fetch(${url})`);
        const result = await fetch(url);
        const response: TFullUserData[] = JSON.parse(await result.text());
        console.log(response);
        return response;
    }

    async forceReelStop(reels: Array<number>): Promise<TResponse> {
        const url = `${this.baseUrl}game/spin/force/?reel_stops=${JSON.stringify(reels)}`;
        console.log(`fetch(${url})`);
        const result = await fetch(url);
        const response: TResponse = JSON.parse(await result.text());
        console.log(response);
        return response;
    }

    async buyCredits(bet: number): Promise<TResponse> {
        const url = `${this.baseUrl}user/buy/?buy_amount=${bet}`;
        console.log(`fetch(${url})`);
        const result = await fetch(url);
        const response: TResponse = JSON.parse(await result.text());
        console.log(response);
        return response;
    }

}
