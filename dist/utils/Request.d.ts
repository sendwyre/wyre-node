import 'es6-shim';
import Authed from '../Authed';
export default class Request extends Authed {
    private static _instance;
    static get instance(): Request;
    get(path: string, params?: any, options?: any): Promise<any>;
    post(path: string, body?: any, options?: any): Promise<any>;
    put(path: string, body?: any, options?: any): Promise<any>;
    delete(path: string, body?: any, options?: any): Promise<any>;
    private request;
    private buildRequestOptions;
    private buildSignature;
}
