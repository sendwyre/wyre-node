export interface Auth {
    secretKey: string;
    apiKey: string;
    masqueradeTarget?: string;
}
export interface Config {
    auth?: Auth;
    apiVersion?: string;
    format?: string;
    qs?: {
        [key: string]: string;
    };
    options?: {
        headers?: {
            [key: string]: string;
        };
    };
}
export default class Authed {
    protected readonly config: Config;
    constructor(config?: Config);
    get isAuthed(): boolean;
}
//# sourceMappingURL=Authed.d.ts.map