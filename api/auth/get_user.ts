import {app, sessionManager} from "../../app";

app.get('/api/auth/get_user', async (req, res) => {
    if (sessionManager.hasSession(req)) {
        const user = sessionManager.getSession(sessionManager.getSessionID(req));
        console.log(user.values());
        res.json({
            user: user.get('user')
        }).end();
    }
    res.status(401).end();
});