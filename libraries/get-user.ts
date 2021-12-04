import {Request} from "express";
import {sessionManager} from "../app";
import {Database} from "./database";
import {User} from "../models/User";

export async function getUser(req: Request): Promise<User> {
    if ('sid' in req.cookies) {
        const session = sessionManager.getSession(req.cookies['sid']);
        return session && session.has('user') ? await Database.getUser('ID', session.get('user').id) : null;
    }
    return null;
}