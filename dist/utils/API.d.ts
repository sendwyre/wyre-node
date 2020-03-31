import 'es6-shim';
import Authed from '../Authed';
export default class API extends Authed {
    get<T extends any>(path: string, params?: any, options?: any): Promise<T>;
    post<T extends any>(path: string, body?: any, options?: any): Promise<T>;
    put<T extends any>(path: string, body?: any, options?: any): Promise<T>;
    delete<T extends any>(path: string, body?: any, options?: any): Promise<T>;
    private request;
    private buildRequestOptions;
    private buildSignature;
}
//# sourceMappingURL=API.d.ts.map