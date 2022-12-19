export type TFullUserData = {
    general:TUserData,
    loginData:TUserLoginData,
    stats:TUserStatsData
};
export type TUserData = {
    login:string,
    lang:string,
    denominator:number,
    currency:string
}

export type TUserLoginData = {
    pass:string,
    login:string,
}

export type TUserStatsData = {
    freeGames:number,
    balance:number,
    reelStops:number[],
}

export type TSymbols = {
    name:string,
    isWild:boolean,
    isScatter:boolean,
    id:number,
}

export type TBet = {
    id:number;
    value:number
};

export type TBetRequest = {
    bet_id:string;
};

export type TBuyAmountRequest = {
    /**
     * amount of credits that should be added to the user balance
     */
    buy_amount:string;
};

export type TForceRequest = {
    /**
     * it should be json array like: '[0,0,0,0,0]'
     */
    reel_stops:string;
};

export type TReel = [number, number, number];
export type TReelWindow = [TReel, TReel, TReel, TReel, TReel];

export type TInitResponse = {
    stakes:number[];
    autoPlays:number[];
    strips:number[][];
    lines:number[][];
    bets:TBet[];
    symbols:TSymbols[];
    user:TUserData;
    userStats:TUserStatsData;
}

type TSymbolPosition = {
    x:number;
    y:number;
}

export type TScatterWin = {
    symbolId:number;
    symbolsAmount:number;
    win:number;
    symbols:TSymbolPosition[]
}
export type TWin = {
    lineId:number;
    symbolId:number;
    symbolsAmount:number;
    win:number;
}

type TResponseStatus = "Ok" | "Bad"

export type TResponse = {
    status:TResponseStatus;
    reason:string;
}

export type TSpinResponse = {
    user:TUserData;
    userStats:TUserStatsData;
    wins:TWin[];
    scatterWins:TScatterWin[];
    totalWin:number;
    finalReelWindow:TReelWindow;
}