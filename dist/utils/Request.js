"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const crypto = require("crypto");
const querystring = require("querystring");
const url = require("url");
require("es6-shim");
const Authed_1 = require("../Authed");
const WYRE_BASEURL = 'https://api.testwyre.com/v3';
const WYRE_DEFAULT_API_FORMAT = 'json';
class Request extends Authed_1.default {
    static get instance() {
        if (this._instance)
            return this._instance;
        this._instance =
        ;
    }
    get(path, params, options) {
        return this.request('GET', path, params, options);
    }
    post(path, body, options) {
        return this.request('POST', path, body, options);
    }
    put(path, body, options) {
        return this.request('PUT', path, body, options);
    }
    delete(path, body, options) {
        return this.request('DELETE', path, body, options);
    }
    request(method, path, params = {}, options = {}) {
        if (!path)
            throw 'path required';
        let requestOptions = this.buildRequestOptions(method, path, params, options);
        return new Promise((resolve, reject) => {
            request(requestOptions, (err, res) => {
                if (err)
                    throw err;
                else if (res.statusCode >= 200 && res.statusCode < 300)
                    resolve(res.body || {});
                else
                    reject(res.body || { statusCode: res.statusCode });
            });
        });
    }
    buildRequestOptions(method, path, params, options) {
        options = options || {};
        let parsedUrl = url.parse(url.resolve(WYRE_BASEURL, path), true);
        let json = !(options.headers || {}).hasOwnProperty('Content-Type') || options.headers['Content-Type'] == 'application/json';
        let requestOptions = {
            ...this.config.options,
            ...options,
            url: parsedUrl.protocol + '//' + parsedUrl.host + parsedUrl.pathname,
            method: method,
            headers: {
                ...this.config.options.headers,
                ...options.headers
            },
            qs: {
                ...this.config.qs,
                ...options.qs,
                timestamp: new Date().getTime(),
                format: this.config.format || WYRE_DEFAULT_API_FORMAT
            },
            json: json
        };
        if (requestOptions.method == 'GET')
            requestOptions.qs = Object.assign(requestOptions.qs, params);
        else
            requestOptions.body = params;
        Object.assign(requestOptions.qs, parsedUrl.query);
        if (this.isAuthed && this.config.auth.masqueradeTarget && !('masqueradeAs' in requestOptions))
            requestOptions.qs.masqueradeAs = this.config.auth.masqueradeTarget;
        if (this.isAuthed) {
            requestOptions.headers['X-Api-Key'] = this.config.auth.apiKey;
            requestOptions.headers['X-Api-Signature'] = this.buildSignature(requestOptions);
        }
        return requestOptions;
    }
    buildSignature(requestOptions) {
        let buffers = [];
        const encoding = 'utf8';
        buffers.push(Buffer.from(requestOptions.url.toString(), encoding));
        buffers.push(Buffer.from(requestOptions.url.toString().indexOf('?') < 0 ? '?' : '&', encoding));
        buffers.push(Buffer.from(querystring.stringify(requestOptions.qs), encoding));
        if (requestOptions.body) {
            if (typeof requestOptions.body == 'string')
                buffers.push(Buffer.from(requestOptions.body, encoding));
            else if (requestOptions.body instanceof Buffer)
                buffers.push(requestOptions.body);
            else
                buffers.push(Buffer.from(JSON.stringify(requestOptions.body), encoding));
        }
        return crypto.createHmac('sha256', this.config.auth.secretKey)
            .update(Buffer.concat(buffers))
            .digest('hex');
    }
}
exports.default = Request;
