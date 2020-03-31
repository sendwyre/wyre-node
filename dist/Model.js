"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Model = (function () {
    function Model(data, api) {
        this.data = {};
        this.set(data);
        this.api = api;
        var proxy = new Proxy(this, {
            set: function (target, key, value) {
                key in target.data
                    ? target.data[key] = value
                    : target[key] = value;
            },
            get: function (target, key) {
                return key in target.data
                    ? target.data[key]
                    : target[key];
            }
        });
        return proxy;
    }
    Model.prototype.set = function (data) {
        for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            this.data[key] = value;
        }
    };
    return Model;
}());
exports.default = Model;
