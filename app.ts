import * as express from 'express';
import * as fs from 'fs';
import {SessionManager} from "./session-manager";
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

export const app = express();
export const sessionManager = new SessionManager();

app.use(cookieParser());
app.use(bodyParser.json());

app.use(async function (req, res, next) {

    let sid = {
        value: null
    };

    console.log(req.path);

    if (sessionManager.hasSession(req)) {
        console.log('There is a session!');
        next();

        return;
    }

    console.log('No session found.');

    const session = sessionManager.createSession();
    res.cookie('sid', session.sid);

    req.headers.cookie = 'sid=' + session.sid;

    if (req.path === '/auth/login') {
        next();
        return;
    }

    // Handle API authorization
    if (req.path.startsWith('/api/')) {
        // res.redirect(`/login?return=${req.path}`);
        console.log('Set Cookie. SID = ' + req.headers.cookie);
        next();

        return;
    } else if (req.path !== '/login') {
        res.status(401).end();
    } else {
        console.log('Set Cookie 2.');
        next();

        return;
    }

});

function loadRoutes(path: string) {
    const lstat = fs.lstatSync(path);
    if (lstat.isDirectory()) {
        fs.readdirSync(path).forEach(file => {
            if (file.endsWith('.js')) {
                require(`${path}/${file}`);
            }

            loadRoutes(`${path}/${file}`);
        })
    }
}

loadRoutes('./api');
app.listen(25002);