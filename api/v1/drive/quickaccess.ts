import * as fs from "fs";
import {getFolderName} from "./index";
import {Request, Response} from "express";
import {getUser} from "../../../libraries/get-user";
import {app} from "../../../app";

app.get('/api/v1/user/drive/quickaccess', async (req: Request, res: Response) => {

    const folder = req.params.folder;

    const user = await getUser(req);
    const drivePath = `./data/users/${user.id}/drive`;

    let quickAccessFolders: string[] = [];
    if (fs.existsSync(`${drivePath}/quick-access.json`)) {
        quickAccessFolders = JSON.parse(fs.readFileSync(`${drivePath}/quick-access.json`).toString()).folders;
    }

    const quickAccessFoldersMapped = [];
    for (const id of quickAccessFolders) {
        quickAccessFoldersMapped.push(getFolderName(req, folder));
    }

    res.status(200).json(quickAccessFolders);

});

app.post('/api/v1/user/drive/quickaccess', async (req: Request, res: Response) => {

    const folder = req.params.folder;

    const user = await getUser(req);
    const drivePath = `./data/users/${user.id}/drive`;

    let quickAccessFolders: string[] = [];
    if (fs.existsSync(`${drivePath}/quick-access.json`)) {
        quickAccessFolders = JSON.parse(fs.readFileSync(`${drivePath}/quick-access.json`).toString()).folders;
    }

    if (folder === undefined) {
        res.status(400).json({
            details: 'Folder not specified.'
        });
        return;
    }

    const index = quickAccessFolders.findIndex(i => i === folder);
    if (index !== -1) {
        res.status(200).end();
        return;
    } else {
        if (!fs.existsSync(`${drivePath}/${folder}`)) {
            res.status(400).end();
            return;
        }
        quickAccessFolders.push(folder);
    }

    fs.writeFileSync(`${drivePath}/quick-access.json`, JSON.stringify({
        folders: quickAccessFolders
    }));

    res.status(200).end();

});

app.delete('/api/v1/user/drive/quickaccess', async (req: Request, res: Response) => {

    const folder = req.params.folder;

    const user = await getUser(req);
    const drivePath = `./data/users/${user.id}/drive`;

    let quickAccessFolders: string[] = [];
    if (fs.existsSync(`${drivePath}/quick-access.json`)) {
        quickAccessFolders = JSON.parse(fs.readFileSync(`${drivePath}/quick-access.json`).toString()).folders;
    }

    if (folder === undefined) {
        res.status(400).json({
            details: 'Folder not specified.'
        });
        return;
    }

    const index = quickAccessFolders.findIndex(i => i === folder);
    if (index !== -1) {
        quickAccessFolders.splice(index, 1);
    } else {
        res.status(200).end();
        return;
    }

    fs.writeFileSync(`${drivePath}/quick-access.json`, JSON.stringify({
        folders: quickAccessFolders
    }));

    res.status(200).end();

});