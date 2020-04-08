"use strict";
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
var Api = (function () {
    function Api(config) {
        var defaultConfig = {
            uri: 'https://api.sendwyre.com',
            version: '3',
            format: 'json',
            qs: {},
            headers: {
                'Content-Type': 'application/json'
            }
        };
        this.config = Object.assign({}, defaultConfig, config);
    }
    Object.defineProperty(Api.prototype, "isAuthed", {
        get: function () {
            return !!this.config.auth && !!this.config.auth.secretKey && !!this.config.auth.apiKey;
        },
        enumerable: true,
        configurable: true
    });
    Api.prototype.requireAuthed = function () {
        if (!this.isAuthed)
            throw new Error('Must be authenticated for this endpoint.');
    };
    Api.prototype.masqueradeAs = function (id) {
        if (!this.isAuthed)
            throw new Error('Cannot masquerade with no authorization.');
        var newConfig = Object.assign({}, this.config);
        newConfig.auth.masqueradeTarget = id;
        return new Api(newConfig);
    };
    Api.prototype.get = function (path, params, options) {
        return this.request('GET', path, params, options);
    };
    Api.prototype.post = function (path, body, options) {
        return this.request('POST', path, body, options);
    };
    Api.prototype.put = function (path, body, options) {
        return this.request('PUT', path, body, options);
    };
    Api.prototype.delete = function (path, body, options) {
        return this.request('DELETE', path, body, options);
    };
    Api.prototype.request = function (method, path, params, options) {
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
    Api.prototype.buildRequestOptions = function (method, path, params, options) {
        var config = __assign(__assign(__assign({}, this.config), options), { headers: __assign(__assign({}, this.config.headers), options.headers), qs: __assign(__assign({}, this.config.qs), options.qs) });
        var parsedUrl = url.parse(url.resolve(config.uri, "v" + config.version + "/" + path), true);
        var json = config.headers['Content-Type'] === 'application/json';
        var requestOptions = __assign(__assign({}, options), { url: parsedUrl.protocol + '//' + parsedUrl.host + parsedUrl.pathname, method: method, headers: __assign({}, config.headers), qs: __assign(__assign({}, config.qs), { timestamp: new Date().getTime(), format: this.config.format }), json: json });
        if (requestOptions.method == 'GET')
            requestOptions.qs = Object.assign(requestOptions.qs, params);
        else
            requestOptions.body = params;
        Object.assign(requestOptions.qs, parsedUrl.query);
        if (this.isAuthed && config.auth.masqueradeTarget && !('masqueradeAs' in requestOptions))
            requestOptions.qs.masqueradeAs = config.auth.masqueradeTarget;
        if (this.isAuthed) {
            requestOptions.headers['X-Api-Key'] = config.auth.apiKey;
            requestOptions.headers['X-Api-Signature'] = this.buildSignature(requestOptions);
        }
        return requestOptions;
    };
    Api.prototype.buildSignature = function (requestOptions) {
        this.requireAuthed();
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
    return Api;
}());
exports.default = Api;
