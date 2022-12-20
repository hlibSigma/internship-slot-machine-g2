import gameModel from "app/model/GameModel";
import RequestService from "./service/RequestService";

export default class ServerCommunicator {
    private request: RequestService;

    constructor(protected readonly mainUrl: string) {
        this.request = new RequestService(mainUrl);
    }

    async login(userName: string) {
        const response = await this.request.login(userName)
        gameModel.gameSignals.data.login.emit(response);
        return response;
    }

    async spin(betId: number) {
        const response = await this.request.spin(betId);
        gameModel.gameSignals.data.spin.emit(response);
        return response;
    }

    async getAllUsers() {
        const response = await this.request.getAllUsers();
        gameModel.gameSignals.data.users.emit(response);
        return response;
    }

    async forceReelStop(reels: Array<number>) {
        const response = await this.request.forceReelStop(reels);
        gameModel.gameSignals.data.stopReel.emit(response);
        return response;
    }

    async buyCredits(bet: number) {
        const response = await this.request.buyCredits(bet);
        gameModel.gameSignals.data.buyAmount.emit(response);
        return response;
    }

}
