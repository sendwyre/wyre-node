"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Data = (function () {
    function Data(data) {
        this.initValues = data;
        this.updatedValues = data;
    }
    Object.defineProperty(Data.prototype, "isChanged", {
        get: function () {
            var initValues = JSON.stringify(this.initValues);
            var updatedValues = JSON.stringify(this.updatedValues);
            return initValues !== updatedValues;
        },
        enumerable: true,
        configurable: true
    });
    Data.prototype.set = function (key, value) {
        if (typeof key === 'object') {
            for (var _i = 0, _a = Object.entries(key); _i < _a.length; _i++) {
                var _b = _a[_i], k = _b[0], v = _b[1];
                this.updatedValues[k] = v;
            }
        }
        else {
            this.updatedValues[key] = value;
        }
    };
    Data.prototype.get = function (key) {
        return this.updatedValues[key];
    };
    return Data;
}());
exports.default = Data;
