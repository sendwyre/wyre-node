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
var PaymentMethod_1 = require("./PaymentMethod");
var Transfer = (function (_super) {
    __extends(Transfer, _super);
    function Transfer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Transfer.verifyCreateParams = function (params) {
        if (params.sourceAmount && params.destinationAmount)
            throw new Error('Cannot have both source and destination amounts defined.');
    };
    Transfer.create = function (api, params) {
        return __awaiter(this, void 0, void 0, function () {
            var paymentMethods, isACH, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        api.requireAuthed();
                        this.verifyCreateParams(params);
                        if (!(params.source instanceof PaymentMethod_1.default && params.source.linkType === 'LOCAL_TRANSFER')) return [3, 1];
                        params.source = params.source.srn + ":ach";
                        return [3, 3];
                    case 1:
                        if (!(typeof params.source === 'string' && /paymentmethod:/.test(params.source))) return [3, 3];
                        return [4, PaymentMethod_1.default.fetchAll(api)];
                    case 2:
                        paymentMethods = _a.sent();
                        isACH = paymentMethods.some(function (method) { return method.srn === params.source && method.linkType === 'LOCAL_TRANSFER'; });
                        params.source += ':ach';
                        _a.label = 3;
                    case 3: return [4, api.post('transfers', params)];
                    case 4:
                        data = _a.sent();
                        return [2, new Transfer(data, api)];
                }
            });
        });
    };
    Transfer.fetchAll = function (api) {
        return __awaiter(this, void 0, void 0, function () {
            var transfers, offset, length, hasMore, _a, data, recordsTotal, position, mappedTransfers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        api.requireAuthed();
                        transfers = [];
                        offset = 0;
                        length = 20;
                        hasMore = true;
                        _b.label = 1;
                    case 1: return [4, api.get('transfers', { offset: offset, length: length })];
                    case 2:
                        _a = _b.sent(), data = _a.data, recordsTotal = _a.recordsTotal, position = _a.position;
                        mappedTransfers = data.map(function (transferData) { return new Transfer(transferData, api); });
                        transfers.push.apply(transfers, mappedTransfers);
                        hasMore = Math.ceil(recordsTotal / length) - 1 !== position;
                        if (hasMore)
                            offset += length;
                        _b.label = 3;
                    case 3:
                        if (hasMore) return [3, 1];
                        _b.label = 4;
                    case 4: return [2, transfers];
                }
            });
        });
    };
    Transfer.fetch = function (api, id) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        api.requireAuthed();
                        return [4, api.get("transfers/" + id)];
                    case 1:
                        data = _a.sent();
                        return [2, new Transfer(data, api)];
                }
            });
        });
    };
    Transfer.prototype.confirm = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.api.post("transfers/" + this.id + "/confirm")];
                    case 1:
                        data = _a.sent();
                        this.set(data);
                        return [2];
                }
            });
        });
    };
    return Transfer;
}(Model_1.default));
exports.default = Transfer;
