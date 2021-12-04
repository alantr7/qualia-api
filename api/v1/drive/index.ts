import * as fs from "fs";
import formidable, {Files} from "formidable";
import PersistentFile from "formidable/PersistentFile";
import {Request, Response} from "express";
import {getUser} from "../../../libraries/get-user";
import {app} from "../../../app";

export const getFile = async (req: Request, res: Response, path) => {

    const user = await getUser(req);

    let realPath = `./data/users/${user.id}/drive/${path}`;
    console.log('Path: ' + realPath);
    if (realPath.endsWith('/'))
        realPath = realPath.substr(0, realPath.length - 1);

    if (fs.existsSync(realPath) && fs.lstatSync(realPath).isDirectory()) {
        const files = [];
        const folders = [];
        fs.readdirSync(realPath).forEach(fileName => {
            if (fileName.endsWith('.file') || fileName === 'meta.json')
                return;

            const meta = fs.readFileSync(`${realPath}/${fileName}`).toString();
            files.push({
                id: fileName.substr(0, fileName.indexOf('.')),
                ...JSON.parse(meta),
            });
        });
        if (fs.existsSync(`${realPath}/meta.json`)) {
            const foldersJson = JSON.parse(fs.readFileSync(`${realPath}/meta.json`).toString()).folders;
            if (foldersJson !== undefined)
                Object.keys(foldersJson).forEach(id => {
                    folders.push({
                        id: id,
                        name: foldersJson[id]['name']
                    })
                });
        }
        res.json({
            folders: folders,
            files: files
        })
    } else if (fs.existsSync(`${realPath}.meta.json`)) {
        res.json(JSON.parse(fs.readFileSync(`${realPath}.meta.json`).toString()));
    } else {
        res.status(404).end();
    }

};

export const getFolderName = async (req: Request, id: string): Promise<string | null> => {

    const user = await getUser(req);

    if (id === 'root') return 'root';

    let parentPath = `./data/users/${user.id}/drive/${parent}`;
    if (parentPath.endsWith('/'))
        parentPath = parentPath.substr(0, parentPath.length - 1);

    let folderPath = `./data/users/${user.id}/drive/${id}`;
    if (folderPath.endsWith('/'))
        folderPath = folderPath.substr(0, folderPath.length - 1);

    if (fs.existsSync(parentPath) && fs.existsSync(folderPath)) {
        const lstat = fs.lstatSync(parentPath);
        if (!lstat.isDirectory()) {
            return null;
        }

        const folderStat = fs.lstatSync(folderPath);
        if (!folderStat.isDirectory()) {
            return null;
        }

        const json = fs.existsSync(`${parentPath}/meta.json`) ? JSON.parse(fs.readFileSync(`${parentPath}/meta.json`).toString()) : {};
        if (!(id in json)) {
            return null;
        }

        return json[id];

    } else {
        return null;
    }

};

app.get('/api/v1/user/drive', async (req: Request, res: Response) => {
    await getFile(req, res, 'root');
});

app.get('/api/v1/user/drive/:folder', async (req: Request, res: Response) => {
    await getFile(req, res, req.params.folder);
});