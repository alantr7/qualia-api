import * as fs from "fs";
import * as formidable from "formidable";
import {app} from "../../../app";
import {Request, Response} from "express";
import {getUser} from "../../../libraries/get-user";

export const config = {
    api: {
        bodyParser: false
    }
};

const uploadFile = async (req: Request, res: Response) => {
    return new Promise((async (resolve) => {

        const path = req.query.folder as string;
        const user = await getUser(req);

        const drivePath = `./data/users/${user.id}/drive`;

        if (!fs.existsSync(`${drivePath}/${path}`)) {
            if (path === 'root') {
                fs.mkdirSync(`${drivePath}/root`);
            } else {
                res.status(404).json({
                    details: 'Path not found.'
                }).end();
                return;
            }
        }

        let name;
        let extension;

        const form = new formidable.IncomingForm({
            uploadDir: `./data/users/${user.id}/drive/${path}`,
            filename: ((_name, _ext) => {
                name = _name;
                extension = _ext;
                return Date.now() + '.file';
            })
        });

        form.parse(req, (err, fields, files) => {

            const file = files.file as {
                filepath,
                originalFilename,
                newFilename,
                size
            };

            const id = file.newFilename.substr(0, file.newFilename.indexOf('.'));

            fs.writeFileSync(`./data/users/${user.id}/drive/${path}/${id}.meta.json`, JSON.stringify({
                id: id,
                name: name,
                extension: file.originalFilename.length !== name.length
                    ? file.originalFilename.substr(name.length + 1)
                    : name,
                size: file.size
            }));

            resolve(files);

        });

    }));

};

app.post('/api/v1/user/drive/:folder/files', async (req, res) => {
    await uploadFile(req, res);
    res.json({});
    return;
});