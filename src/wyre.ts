import * as request from 'request'
import * as crypto from 'crypto'
import * as querystring from 'querystring'
import * as url from 'url'
import 'es6-shim'

const WYRE_BASEURL = "https://api.sendwyre.com"
const WYRE_DEFAULT_API_VERSION = "2"
const WYRE_DEFAULT_API_FORMAT = "json"

export class WyreClient {

    constructor(private config: any, private masqueradeTarget?: string) {
        if(!config.secretKey) throw new Error('config.secretKey is missing');
        if(!config.apiKey)  throw new Error('config.apiKey is missing');
        this.config.options = this.config.options || {};
    }

    public get(path: string, params?: any, options?: any): Promise<any> {
        return this.request("GET", path, params, options)
    }

    public post(path: string, body?: any, options?: any): Promise<any> {
        return this.request("POST", path, body, options)
    }

    public put(path: string, body?: any, options?: any): Promise<any> {
        return this.request("PUT", path, body, options)
    }

    public delete(path: string, body?: any, options?: any): Promise<any> {
        return this.request("DELETE", path, body, options)
    }

    /**
     * returns a new wyre client which is ostensibly authenticated as the supplied
     * target
     *
     * @param target an account ID or an SRN
     */
    public masqueraded(target: string): WyreClient {
        return new WyreClient(this.config, target);
    }

    private request(method: string, path: string, params: any = {}, options: any = {}): Promise<any> {
        if(!path)
            throw "path required"

        let requestOptions = this.buildRequestOptions(method, path, params, options)

        return new Promise((resolve, reject) => {
            request(requestOptions, (err, res) => {
                if(err)
                    throw err;
                else if(res.statusCode >= 200 && res.statusCode < 300)
                    resolve(res.body || {})
                else
                    reject(res.body || { statusCode: res.statusCode })
            })
        })
    }

    private buildRequestOptions(method: string, path: string, params: any, options: any): request.UrlOptions & request.CoreOptions {
        options = options || {};

        let parsedUrl = url.parse(url.resolve(this.config.baseUrl || WYRE_BASEURL, path), true)
        let json = !(options.headers || {}).hasOwnProperty('Content-Type') || options.headers['Content-Type'] == 'application/json';

        let requestOptions: request.UrlOptions & request.CoreOptions = {
            ...this.config.options,
            ...options,
            url: parsedUrl.protocol + "//" + parsedUrl.host + parsedUrl.pathname, // no querystring here!
            method: method,
            headers: {
                ...this.config.options.headers,
                ...options.headers,
                "X-Api-Version": this.config.apiVersion || WYRE_DEFAULT_API_VERSION,
                "X-Api-Key": this.config.apiKey
            },
            qs: {
                ...this.config.qs,
                ...options.qs,
                timestamp: new Date().getTime(),
                format: this.config.format || WYRE_DEFAULT_API_FORMAT
            },
            json: json
        };

        if(requestOptions.method == "GET")
            requestOptions.qs = Object.assign(requestOptions.qs, params)
        else
            requestOptions.body = params

        Object.assign(requestOptions.qs, parsedUrl.query);
        if(this.masqueradeTarget && !('masqueradeAs' in requestOptions))
            requestOptions.qs.masqueradeAs = this.masqueradeTarget;

        requestOptions.headers["X-Api-Signature"] = this.buildSignature(requestOptions);

        return requestOptions
    }

    private buildSignature(requestOptions: request.UrlOptions & request.CoreOptions): string {
        let buffers: Buffer[] = [];
        const encoding = 'utf8';

        buffers.push(Buffer.from(requestOptions.url.toString(), encoding));
        buffers.push(Buffer.from(requestOptions.url.toString().indexOf('?') < 0 ? "?" : "&", encoding));
        buffers.push(Buffer.from(querystring.stringify(requestOptions.qs), encoding));

        if(requestOptions.body) {
            if(typeof requestOptions.body == 'string')
                buffers.push(Buffer.from(requestOptions.body, encoding));
            else if(requestOptions.body instanceof Buffer)
                buffers.push(requestOptions.body);
            else
                buffers.push(Buffer.from(JSON.stringify(requestOptions.body), encoding));
        }

        return crypto.createHmac("sha256", this.config.secretKey)
            .update(Buffer.concat(buffers))
            .digest("hex")
    }
}
