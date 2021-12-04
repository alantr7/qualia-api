"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../../app");
app_1.app.get('/api/auth/logout', function (req, res) {
    var session = app_1.sessionManager.getSession(req.cookies['sid']);
    if (session) {
        session.destroy();
    }
    res.status(200).end();
});
//# sourceMappingURL=logout.js.map