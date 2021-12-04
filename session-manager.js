"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = exports.SessionManager = void 0;
var SessionManager = /** @class */ (function () {
    function SessionManager() {
        this.cache = {};
        this.getSession = this.getSession.bind(this);
        this.hasSession = this.hasSession.bind(this);
        this.createSession = this.createSession.bind(this);
        this.getSessionID = this.getSessionID.bind(this);
    }
    SessionManager.prototype.getSession = function (sid) {
        return this.cache[sid] || new Session(this, sid);
        // return JSON.parse(fs.readFileSync(`../sessions/sess_${cookies['sid']}.json`).toString());
    };
    SessionManager.prototype.hasSession = function (sid) {
        if (typeof sid === 'string')
            return sid in this.cache;
        if ('sid' in sid.cookies)
            return sid.cookies['sid'] in this.cache;
        return false;
    };
    SessionManager.prototype.getSessionID = function (req) {
        if ('sid' in req.cookies) {
            return req.cookies['sid'];
        }
        return null;
    };
    SessionManager.prototype.createSession = function () {
        var sid = Math.round(Math.random() * 10000).toString();
        var session = new Session(this, sid);
        this.cache[sid] = session;
        return session;
    };
    return SessionManager;
}());
exports.SessionManager = SessionManager;
var Session = /** @class */ (function () {
    function Session(mgrInstance, sid) {
        this._values = {};
        this._lastModified = 0;
        this.mgrInstance = mgrInstance;
        this.sid = sid;
        this.set = this.set.bind(this);
        this.get = this.get.bind(this);
        this.has = this.has.bind(this);
        this.values = this.values.bind(this);
        this.destroy = this.destroy.bind(this);
        this.lastModified = this.lastModified.bind(this);
    }
    Session.prototype.set = function (name, value) {
        this._values[name] = value;
        this._lastModified = Date.now();
    };
    Session.prototype.get = function (name) {
        return this._values[name];
    };
    Session.prototype.has = function (name) {
        return name in this._values;
    };
    Session.prototype.values = function () {
        return this._values;
    };
    Session.prototype.destroy = function () {
        this._values = {};
        delete this.mgrInstance.cache[this.sid];
    };
    Session.prototype.lastModified = function () {
        return this._lastModified;
    };
    return Session;
}());
exports.Session = Session;
//# sourceMappingURL=session-manager.js.map