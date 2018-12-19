"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var crypto = require("crypto");
var querystring = require("querystring");
var url = require("url");
require("es6-shim");
var WYRE_BASEURL = "https://api.sendwyre.com";
var WYRE_DEFAULT_API_VERSION = "2";
var WYRE_DEFAULT_API_FORMAT = "json";
var WyreClient = (function () {
    function WyreClient(config, masqueradeTarget) {
        this.config = config;
        this.masqueradeTarget = masqueradeTarget;
        if (!config.secretKey)
            throw new Error('config.secretKey is missing');
        if (!config.apiKey)
            throw new Error('config.apiKey is missing');
        this.config.options = this.config.options || {};
    }
    WyreClient.prototype.get = function (path, params, options) {
        return this.request("GET", path, params, options);
    };
    WyreClient.prototype.post = function (path, body, options) {
        return this.request("POST", path, body, options);
    };
    WyreClient.prototype.put = function (path, body, options) {
        return this.request("PUT", path, body, options);
    };
    WyreClient.prototype.delete = function (path, body, options) {
        return this.request("DELETE", path, body, options);
    };
    WyreClient.prototype.masqueraded = function (target) {
        return new WyreClient(this.config, target);
    };
    WyreClient.prototype.request = function (method, path, params, options) {
        if (params === void 0) { params = {}; }
        if (options === void 0) { options = {}; }
        if (!path)
            throw "path required";
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
    WyreClient.prototype.buildRequestOptions = function (method, path, params, options) {
        options = options || {};
        var parsedUrl = url.parse(url.resolve(this.config.baseUrl || WYRE_BASEURL, path), true);
        var json = !(options.headers || {}).hasOwnProperty('Content-Type') || options.headers['Content-Type'] == 'application/json';
        var requestOptions = __assign({}, this.config.options, options, { url: parsedUrl.protocol + "//" + parsedUrl.host + parsedUrl.pathname, method: method, headers: __assign({}, this.config.options.headers, options.headers, { "X-Api-Version": this.config.apiVersion || WYRE_DEFAULT_API_VERSION, "X-Api-Key": this.config.apiKey }), qs: {
                timestamp: new Date().getTime(),
                format: this.config.format || WYRE_DEFAULT_API_FORMAT
            }, json: json });
        if (requestOptions.method == "GET")
            requestOptions.qs = Object.assign(requestOptions.qs, params);
        else
            requestOptions.body = params;
        Object.assign(requestOptions.qs, parsedUrl.query);
        if (this.masqueradeTarget && !('masqueradeAs' in requestOptions))
            requestOptions.qs.masqueradeAs = this.masqueradeTarget;
        requestOptions.headers["X-Api-Signature"] = this.buildSignature(requestOptions);
        return requestOptions;
    };
    WyreClient.prototype.buildSignature = function (requestOptions) {
        var url = requestOptions.url + "?" + querystring.stringify(requestOptions.qs);
        if (requestOptions.body)
            url += JSON.stringify(requestOptions.body);
        return crypto.createHmac("sha256", this.config.secretKey)
            .update(url)
            .digest("hex");
    };
    return WyreClient;
}());
exports.WyreClient = WyreClient;
