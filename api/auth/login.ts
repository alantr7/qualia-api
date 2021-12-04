import * as bcrypt from 'bcrypt'
import {app, sessionManager} from "../../app";
import {Database} from "../../libraries/database";

app.post('/api/auth/login', async (req, res) => {

    const session = sessionManager.getSession(req.cookies['sid']);
    if (session.has('user')) {
        res.status(200).json({
            id: session.get('user').id,
            username: session.get('user').username,
            details: 'Already logged in.'
        });
        return;
    }

    const [email, password] = [req.body.email, req.body.password];

    if (!email || !password) {
        res.status(400).end();
    }

    const user = await Database.getUser("EMAIL", email);
    if (!user) {
        res.status(404).end();
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
        session.set('user', {
            id: user.id,
            username: user.username
        });
        res.status(200).json({
            id: user.id,
            username: user.username,
            details: 'Successfully logged in.'
        });
    } else {
        res.status(401).end();
    }
});