"use strict";
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
var fs = require("fs");
var index_1 = require("./index");
var get_user_1 = require("../../../libraries/get-user");
var app_1 = require("../../../app");
app_1.app.get('/api/v1/user/drive/quickaccess', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var folder, user, drivePath, quickAccessFolders, quickAccessFoldersMapped, _i, quickAccessFolders_1, id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                folder = req.params.folder;
                return [4 /*yield*/, (0, get_user_1.getUser)(req)];
            case 1:
                user = _a.sent();
                drivePath = "./data/users/" + user.id + "/drive";
                quickAccessFolders = [];
                if (fs.existsSync(drivePath + "/quick-access.json")) {
                    quickAccessFolders = JSON.parse(fs.readFileSync(drivePath + "/quick-access.json").toString()).folders;
                }
                quickAccessFoldersMapped = [];
                for (_i = 0, quickAccessFolders_1 = quickAccessFolders; _i < quickAccessFolders_1.length; _i++) {
                    id = quickAccessFolders_1[_i];
                    quickAccessFoldersMapped.push((0, index_1.getFolderName)(req, folder));
                }
                res.status(200).json(quickAccessFolders);
                return [2 /*return*/];
        }
    });
}); });
app_1.app.post('/api/v1/user/drive/quickaccess', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var folder, user, drivePath, quickAccessFolders, index;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                folder = req.params.folder;
                return [4 /*yield*/, (0, get_user_1.getUser)(req)];
            case 1:
                user = _a.sent();
                drivePath = "./data/users/" + user.id + "/drive";
                quickAccessFolders = [];
                if (fs.existsSync(drivePath + "/quick-access.json")) {
                    quickAccessFolders = JSON.parse(fs.readFileSync(drivePath + "/quick-access.json").toString()).folders;
                }
                if (folder === undefined) {
                    res.status(400).json({
                        details: 'Folder not specified.'
                    });
                    return [2 /*return*/];
                }
                index = quickAccessFolders.findIndex(function (i) { return i === folder; });
                if (index !== -1) {
                    res.status(200).end();
                    return [2 /*return*/];
                }
                else {
                    if (!fs.existsSync(drivePath + "/" + folder)) {
                        res.status(400).end();
                        return [2 /*return*/];
                    }
                    quickAccessFolders.push(folder);
                }
                fs.writeFileSync(drivePath + "/quick-access.json", JSON.stringify({
                    folders: quickAccessFolders
                }));
                res.status(200).end();
                return [2 /*return*/];
        }
    });
}); });
app_1.app.delete('/api/v1/user/drive/quickaccess', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var folder, user, drivePath, quickAccessFolders, index;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                folder = req.params.folder;
                return [4 /*yield*/, (0, get_user_1.getUser)(req)];
            case 1:
                user = _a.sent();
                drivePath = "./data/users/" + user.id + "/drive";
                quickAccessFolders = [];
                if (fs.existsSync(drivePath + "/quick-access.json")) {
                    quickAccessFolders = JSON.parse(fs.readFileSync(drivePath + "/quick-access.json").toString()).folders;
                }
                if (folder === undefined) {
                    res.status(400).json({
                        details: 'Folder not specified.'
                    });
                    return [2 /*return*/];
                }
                index = quickAccessFolders.findIndex(function (i) { return i === folder; });
                if (index !== -1) {
                    quickAccessFolders.splice(index, 1);
                }
                else {
                    res.status(200).end();
                    return [2 /*return*/];
                }
                fs.writeFileSync(drivePath + "/quick-access.json", JSON.stringify({
                    folders: quickAccessFolders
                }));
                res.status(200).end();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=quickaccess.js.map