export interface IApiConfig extends IApiOptions {
    version?: string;
    uri?: string;
    auth?: IAuth;
}
export interface IApiOptions {
    version?: string;
    format?: string;
    headers?: {
        [key: string]: string;
    };
    qs?: {
        [key: string]: string;
    };
    timeout?: number;
}
export interface IAuth {
    secretKey: string;
    apiKey: string;
    masqueradeTarget?: string;
}
//# sourceMappingURL=IApiConfig.d.ts.map