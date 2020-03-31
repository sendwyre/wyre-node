"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Model = (function () {
    function Model(data, api) {
        this.data = {};
        this.set(data);
        this.api = api;
        var proxy = new Proxy(this, new ModelProxyHandler());
        return proxy;
    }
    Model.prototype.set = function (key, value) {
        if (typeof key === 'object') {
            for (var _i = 0, _a = Object.entries(key); _i < _a.length; _i++) {
                var _b = _a[_i], k = _b[0], v = _b[1];
                this.data[k] = v;
            }
        }
        else {
            this.data[key] = value;
        }
    };
    return Model;
}());
exports.default = Model;
var ModelProxyHandler = (function () {
    function ModelProxyHandler() {
    }
    ModelProxyHandler.prototype.getOwnPropertyDescriptor = function (target, p) {
        return { enumerable: true, configurable: true };
    };
    ModelProxyHandler.prototype.set = function (target, key, value) {
        key in target.data
            ? target.set(key, value)
            : target[key] = value;
        return true;
    };
    ModelProxyHandler.prototype.get = function (target, key) {
        return key in target.data
            ? target.data[key]
            : target[key];
    };
    return ModelProxyHandler;
}());
