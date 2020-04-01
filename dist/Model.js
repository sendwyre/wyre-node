"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Data_1 = require("./Model/Data");
var Model = (function () {
    function Model(data, api) {
        this.api = api;
        this.data = new Data_1.default(data);
        var proxy = new Proxy(this, new ModelProxyHandler());
        return proxy;
    }
    Model.prototype.set = function (key, value) {
        this.data.set(key, value);
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
