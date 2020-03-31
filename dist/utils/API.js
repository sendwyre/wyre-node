"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var crypto = require("crypto");
var querystring = require("querystring");
var url = require("url");
require("es6-shim");
var Authed_1 = require("../Authed");
var WYRE_BASEURL = 'https://api.testwyre.com';
var WYRE_API_VERSION = '3';
var WYRE_DEFAULT_API_FORMAT = 'json';
var API = (function (_super) {
    __extends(API, _super);
    function API() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    API.prototype.get = function (path, params, options) {
        return this.request('GET', path, params, options);
    };
    API.prototype.post = function (path, body, options) {
        return this.request('POST', path, body, options);
    };
    API.prototype.put = function (path, body, options) {
        return this.request('PUT', path, body, options);
    };
    API.prototype.delete = function (path, body, options) {
        return this.request('DELETE', path, body, options);
    };
    API.prototype.request = function (method, path, params, options) {
        if (params === void 0) { params = {}; }
        if (options === void 0) { options = {}; }
        if (!path)
            throw 'path required';
        var requestOptions = this.buildRequestOptions(method, path, params, options);
        return new Promise(function (resolve, reject) {
            request(requestOptions, function (err, res) {
                if (err)
                    throw err;
                else if (res.statusCode >= 200 && res.statusCode < 300)
                    resolve(res.body || {});
                else
                    reject(res.body || { statusCode: res.statusCode });
            });
        });
    };
    API.prototype.buildRequestOptions = function (method, path, params, options) {
        options = options || {};
        var parsedUrl = url.parse(url.resolve(WYRE_BASEURL, "v" + WYRE_API_VERSION + "/" + path), true);
        var json = !(options.headers || {}).hasOwnProperty('Content-Type') || options.headers['Content-Type'] == 'application/json';
        var requestOptions = __assign(__assign(__assign({}, this.config.options), options), { url: parsedUrl.protocol + '//' + parsedUrl.host + parsedUrl.pathname, method: method, headers: __assign(__assign({}, this.config.options.headers), options.headers), qs: __assign(__assign(__assign({}, this.config.qs), options.qs), { timestamp: new Date().getTime(), format: this.config.format || WYRE_DEFAULT_API_FORMAT }), json: json });
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
    };
    API.prototype.buildSignature = function (requestOptions) {
        var buffers = [];
        var encoding = 'utf8';
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
    };
    return API;
}(Authed_1.default));
exports.default = API;
