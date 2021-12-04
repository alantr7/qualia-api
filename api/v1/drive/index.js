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
exports.getFolderName = exports.getFile = void 0;
var fs = require("fs");
var get_user_1 = require("../../../libraries/get-user");
var app_1 = require("../../../app");
var getFile = function (req, res, path) { return __awaiter(void 0, void 0, void 0, function () {
    var user, realPath, files_1, folders_1, foldersJson_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, get_user_1.getUser)(req)];
            case 1:
                user = _a.sent();
                realPath = "./data/users/" + user.id + "/drive/" + path;
                console.log('Path: ' + realPath);
                if (realPath.endsWith('/'))
                    realPath = realPath.substr(0, realPath.length - 1);
                if (fs.existsSync(realPath) && fs.lstatSync(realPath).isDirectory()) {
                    files_1 = [];
                    folders_1 = [];
                    fs.readdirSync(realPath).forEach(function (fileName) {
                        if (fileName.endsWith('.file') || fileName === 'meta.json')
                            return;
                        var meta = fs.readFileSync(realPath + "/" + fileName).toString();
                        files_1.push(__assign({ id: fileName.substr(0, fileName.indexOf('.')) }, JSON.parse(meta)));
                    });
                    if (fs.existsSync(realPath + "/meta.json")) {
                        foldersJson_1 = JSON.parse(fs.readFileSync(realPath + "/meta.json").toString()).folders;
                        if (foldersJson_1 !== undefined)
                            Object.keys(foldersJson_1).forEach(function (id) {
                                folders_1.push({
                                    id: id,
                                    name: foldersJson_1[id]['name']
                                });
                            });
                    }
                    res.json({
                        folders: folders_1,
                        files: files_1
                    });
                }
                else if (fs.existsSync(realPath + ".meta.json")) {
                    res.json(JSON.parse(fs.readFileSync(realPath + ".meta.json").toString()));
                }
                else {
                    res.status(404).end();
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getFile = getFile;
var getFolderName = function (req, id) { return __awaiter(void 0, void 0, void 0, function () {
    var user, parentPath, folderPath, lstat, folderStat, json;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, get_user_1.getUser)(req)];
            case 1:
                user = _a.sent();
                if (id === 'root')
                    return [2 /*return*/, 'root'];
                parentPath = "./data/users/" + user.id + "/drive/" + parent;
                if (parentPath.endsWith('/'))
                    parentPath = parentPath.substr(0, parentPath.length - 1);
                folderPath = "./data/users/" + user.id + "/drive/" + id;
                if (folderPath.endsWith('/'))
                    folderPath = folderPath.substr(0, folderPath.length - 1);
                if (fs.existsSync(parentPath) && fs.existsSync(folderPath)) {
                    lstat = fs.lstatSync(parentPath);
                    if (!lstat.isDirectory()) {
                        return [2 /*return*/, null];
                    }
                    folderStat = fs.lstatSync(folderPath);
                    if (!folderStat.isDirectory()) {
                        return [2 /*return*/, null];
                    }
                    json = fs.existsSync(parentPath + "/meta.json") ? JSON.parse(fs.readFileSync(parentPath + "/meta.json").toString()) : {};
                    if (!(id in json)) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, json[id]];
                }
                else {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getFolderName = getFolderName;
app_1.app.get('/api/v1/user/drive', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getFile)(req, res, 'root')];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app_1.app.get('/api/v1/user/drive/:folder', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getFile)(req, res, req.params.folder)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=index.js.map