import 'es6-shim';
export declare class WyreClient {
    private config;
    private masqueradeTarget?;
    constructor(config: any, masqueradeTarget?: string);
    get(path: string, params?: any, options?: any): Promise<any>;
    post(path: string, body?: any, options?: any): Promise<any>;
    put(path: string, body?: any, options?: any): Promise<any>;
    delete(path: string, body?: any, options?: any): Promise<any>;
    masqueraded(target: string): WyreClient;
    private request;
    private buildRequestOptions;
    private buildSignature;
}
