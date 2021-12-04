import {app, sessionManager} from "../../app";

app.get('/api/auth/logout', (req, res) => {

    const session = sessionManager.getSession(req.cookies['sid']);

    if (session) {
        session.destroy();
    }

    res.status(200).end();

});