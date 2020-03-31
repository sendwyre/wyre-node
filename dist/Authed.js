"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Authed = (function () {
    function Authed(config) {
        var defaultConfig = {
            qs: {},
            options: {
                headers: {}
            }
        };
        this.config = Object.assign({}, defaultConfig, config);
    }
    Object.defineProperty(Authed.prototype, "isAuthed", {
        get: function () {
            return !!this.config.auth && !!this.config.auth.secretKey && !!this.config.auth.apiKey;
        },
        enumerable: true,
        configurable: true
    });
    return Authed;
}());
exports.default = Authed;
