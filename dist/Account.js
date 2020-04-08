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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Model_1 = require("./Model");
var Transfer_1 = require("./Transfer");
var PaymentMethod_1 = require("./PaymentMethod");
var Account = (function (_super) {
    __extends(Account, _super);
    function Account() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Account.create = function (api, params) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        api.requireAuthed();
                        return [4, api.post('accounts', params)];
                    case 1:
                        data = _a.sent();
                        if (params.subaccount)
                            api = api.masqueradeAs(data.id);
                        return [2, this.postFetch(data, api)];
                }
            });
        });
    };
    Account.fetch = function (api, id) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        api.requireAuthed();
                        return [4, api.get("accounts/" + id)];
                    case 1:
                        data = _a.sent();
                        return [2, this.postFetch(data, api)];
                }
            });
        });
    };
    Account.postFetch = function (data, api) {
        return __awaiter(this, void 0, void 0, function () {
            var paymentMethods;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, PaymentMethod_1.default.fetchAll(api)];
                    case 1:
                        paymentMethods = _a.sent();
                        return [2, new Account(__assign(__assign({}, data), { paymentMethods: paymentMethods }), api)];
                }
            });
        });
    };
    Account.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.data.isChanged)
                            return [2];
                        return [4, this.api.post("accounts/" + this.id, this.data.updatedValues)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    Account.prototype.createTransfer = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var transfer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, Transfer_1.default.create(this.api, params)];
                    case 1:
                        transfer = _a.sent();
                        return [2, transfer];
                }
            });
        });
    };
    Account.prototype.fetchTransfers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, Transfer_1.default.fetchAll(this.api)];
            });
        });
    };
    Account.prototype.fetchLimits = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.api.requireAuthed();
                return [2, this.api.get('limits')];
            });
        });
    };
    return Account;
}(Model_1.default));
exports.default = Account;
