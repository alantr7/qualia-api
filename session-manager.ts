/*
import * as fs from 'fs'
*/
import {Request} from "express";

export class SessionManager {

    cache: {[key: string]: Session} = {};

    constructor() {
        this.getSession = this.getSession.bind(this);
        this.hasSession = this.hasSession.bind(this);
        this.createSession = this.createSession.bind(this);
        this.getSessionID = this.getSessionID.bind(this);
    }

    getSession(sid): Session {
        return this.cache[sid] || new Session(this, sid);
        // return JSON.parse(fs.readFileSync(`../sessions/sess_${cookies['sid']}.json`).toString());
    }

    hasSession(sid: string | Request): boolean {
        if (typeof sid === 'string')
            return sid in this.cache;

        if ('sid' in sid.cookies)
            return sid.cookies['sid'] in this.cache;

        return false;
    }

    getSessionID(req: Request): string {
        if ('sid' in req.cookies) {
            return req.cookies['sid'];
        }
        return null;
    }

    createSession(): Session {
        const sid = Math.round(Math.random() * 10000).toString();
        const session = new Session(this, sid);

        this.cache[sid] = session;
        return session;
    }

}

export class Session {

    private readonly mgrInstance: SessionManager;

    readonly sid: string;

    private _values: {[key: string]: any} = {};

    private _lastModified: number = 0;

    constructor(mgrInstance, sid: string) {
        this.mgrInstance = mgrInstance;
        this.sid = sid;
        this.set = this.set.bind(this);
        this.get = this.get.bind(this);
        this.has = this.has.bind(this);
        this.values = this.values.bind(this);
        this.destroy = this.destroy.bind(this);
        this.lastModified = this.lastModified.bind(this);
    }

    set(name: string, value: any) {
        this._values[name] = value;
        this._lastModified = Date.now();
    }

    get(name: string): any {
        return this._values[name];
    }

    has(name: string): boolean {
        return name in this._values;
    }

    values(): {[key: string]: any} {
        return this._values;
    }

    destroy() {
        this._values = {};
        delete this.mgrInstance.cache[this.sid];
    }

    lastModified() {
        return this._lastModified;
    }

}