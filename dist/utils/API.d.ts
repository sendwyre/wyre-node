import 'es6-shim';
import Authed from '../Authed';
import { IApiOptions } from './API/IApiOptions';
export default class API extends Authed {
    requireAuthed(): void;
    get<T extends any>(path: string, params?: any, options?: IApiOptions): Promise<T>;
    post<T extends any>(path: string, body?: any, options?: IApiOptions): Promise<T>;
    put<T extends any>(path: string, body?: any, options?: IApiOptions): Promise<T>;
    delete<T extends any>(path: string, body?: any, options?: IApiOptions): Promise<T>;
    private request;
    private buildRequestOptions;
    private buildSignature;
}
//# sourceMappingURL=API.d.ts.map