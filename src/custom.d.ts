export class API {
    constructor(baseURL: string);
    getInfo(opts: API.InfoRequest): API.InfoResponse;
}

declare namespace API {
    export interface InfoRequest {
        id: string;
    }
    export interface InfoResponse {
        width: number;
        height: number;
    }

    function add(a:number):number;
    const a:number;
}
