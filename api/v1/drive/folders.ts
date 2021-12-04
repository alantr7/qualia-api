import * as fs from 'fs';
import {app} from "../../../app";
import {Request, Response} from "express";
import {getUser} from "../../../libraries/get-user";

app.post('/api/v1/user/drive/:folder/folders', async (req: Request, res: Response) => {

    const folder = (req.params.folder as string);

    const user = await getUser(req);
    const drivePath = `./data/users/${user.id}/drive`;
    const path = `${drivePath}/${folder}`;

    // Create a new directory
    if (!fs.existsSync(path)) {
        if (folder === 'root') {
            fs.mkdirSync(`${drivePath}/root`);
        } else {
            res.status(404).json({
                details: 'Path not found.'
            });
            return;
        }
    }

    const name = req.body.name;
    const id = Date.now().toString();

    fs.mkdirSync(`./data/users/${user.id}/drive/${id}`);

    const parentMeta = fs.existsSync(`${path}/meta.json`) ? JSON.parse(fs.readFileSync(`${path}/meta.json`).toString()) : {};
    if (parentMeta.folders === undefined) {
        parentMeta.folders = {};
    }

    parentMeta.folders[id] = {
        name
    };

    fs.writeFileSync(`${path}/meta.json`, JSON.stringify(parentMeta));

    fs.writeFileSync(`./data/users/${user.id}/drive/${id}/meta.json`, JSON.stringify({
        parent: folder
    }));

    res.status(200).json({
        id: id,
        name: name
    });

});