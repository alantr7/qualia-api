import * as fs from "fs";
import {Request, Response} from "express";
import {getUser} from "../../../libraries/get-user";

export default async (req: Request, res: Response) => {
    const filePath = req.query.folder as string;
    const hyphenIndex = filePath.indexOf('-');

    const folder = hyphenIndex !== -1 ? filePath.substring(0, hyphenIndex) : 'root';
    const file = hyphenIndex !== -1 ? filePath.substring(hyphenIndex + 1) : filePath;

    const user = await getUser(req);

    const realPath = `./data/users/${user.id}/drive/${folder}/${file}`;

    if (fs.existsSync(`${realPath}.meta.json`)) {
        const stat = fs.statSync(`${realPath}.file`);

        res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Length': stat.size
        });
        fs.createReadStream(`${realPath}.file`).pipe(res);
        return;
    }

    res.status(404).end();
}