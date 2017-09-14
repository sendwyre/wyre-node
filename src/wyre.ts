import * as request from 'request'
import * as crypto from 'crypto'
import * as querystring from 'querystring'
import * as url from 'url'
import 'es6-shim'

const WYRE_BASEURL = "https://api.sendwyre.com"
const WYRE_DEFAULT_API_VERSION = "2"

export class WyreClient {

    constructor(private config: any) {}

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

    private request(method: string, path: string, params: any = {}, options: any = {}): Promise<any> {
        if(!path)
            throw "path required"

        let requestOptions = this.buildRequestOptions(method, path, params, options)

        return new Promise((resolve, reject) => {
            request(requestOptions, (err, res) => {
                if(err)
                    throw err
                if(("" + res.statusCode).match(/^2\d\d$/))
                    resolve(res.body || {})
                else
                    reject(res.body)
            })
        })
    }

    private buildRequestOptions(method: string, path: string, params: any, options: any): request.UrlOptions & request.CoreOptions {
        let requestOptions: request.UrlOptions & request.CoreOptions = {
            url: url.resolve(this.config.baseUrl || WYRE_BASEURL, path),
            method: method,
            headers: {
                "X-Api-Version": this.config.apiVersion || WYRE_DEFAULT_API_VERSION,
                "X-Api-Key": this.config.apiKey
            },
            qs: {
                timestamp: new Date().getTime()
            },
            json: true
        }

        if(requestOptions.method == "GET")
            requestOptions.qs = Object.assign(requestOptions.qs, params)
        else
            requestOptions.body = params

        requestOptions.headers["X-Api-Signature"] = this.buildSignature(requestOptions)
        requestOptions = Object.assign(requestOptions, this.config.options)
        requestOptions = Object.assign(requestOptions, options)

        return requestOptions
    }

    private buildSignature(requestOptions: request.UrlOptions & request.CoreOptions): string {
        let url = requestOptions.url + "?" + querystring.stringify(requestOptions.qs)
        if(requestOptions.body)
            url += JSON.stringify(requestOptions.body)
        return crypto.createHmac("sha256", this.config.secretKey)
            .update(url)
            .digest("hex")
    }
}
