import 'es6-shim';
import { IApiConfig, IApiOptions } from './API/IApiConfig';
export default class Api {
    readonly config: IApiConfig;
    constructor(config?: IApiConfig);
    get isAuthed(): boolean;
    requireAuthed(): void;
    masqueradeAs(id: string): Api;
    get<T extends any>(path: string, params?: object, options?: IApiOptions): Promise<T>;
    post<T extends any>(path: string, body?: object, options?: IApiOptions): Promise<T>;
    put<T extends any>(path: string, body?: object, options?: IApiOptions): Promise<T>;
    delete<T extends any>(path: string, body?: object, options?: IApiOptions): Promise<T>;
    private request;
    private buildRequestOptions;
    private buildSignature;
}
//# sourceMappingURL=Api.d.ts.map