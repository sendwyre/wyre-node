"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var crypto = require("crypto");
var querystring = require("querystring");
var url = require("url");
require("es6-shim");
var WYRE_BASEURL = "https://api.sendwyre.com";
var WYRE_DEFAULT_API_VERSION = "2";
var WyreClient = (function () {
    function WyreClient(config) {
        this.config = config;
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
                else if (("" + res.statusCode).match(/^2\d\d$/))
                    resolve(res.body || {});
                else
                    reject(res.body);
            });
        });
    };
    WyreClient.prototype.buildRequestOptions = function (method, path, params, options) {
        var requestOptions = {
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
        };
        if (requestOptions.method == "GET")
            requestOptions.qs = Object.assign(requestOptions.qs, params);
        else
            requestOptions.body = params;
        requestOptions.headers["X-Api-Signature"] = this.buildSignature(requestOptions);
        requestOptions = Object.assign(requestOptions, this.config.options);
        requestOptions = Object.assign(requestOptions, options);
        return requestOptions;
    };
    WyreClient.prototype.buildSignature = function (requestOptions) {
        var url = requestOptions.url + "?" + querystring.stringify(requestOptions.qs);
        if (requestOptions.body)
            url += JSON.stringify(requestOptions.body);
        return crypto.createHmac("sha256", this.config.secretKey)
            .update(url.toString())
            .digest("hex");
    };
    return WyreClient;
}());
exports.WyreClient = WyreClient;
