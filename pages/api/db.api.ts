import {NextApiResponse} from "next";
import {DbLocal} from "./lib/dbLocal";
import {Client} from "@replit/database";

export interface DeleteBody {
    method: 'delete'
    key: string
}

export interface DeleteMultipleBody {
    method: 'deleteMultiple'
    args
}

export interface EmptyBody {
    method: 'empty'
}

export interface GetBody {
    method: 'get'
    key: string
}


export interface GetAllBody {
    method: 'getAll'
}


export interface ListBody {
    method: 'list'
    prefix: string
}


export interface SetBody {
    method: 'set'
    key: string
    value: string
}


export interface SetAllBody {
    method: 'setAll'
    obj
}


export interface DBApiInterface extends NextApiResponse {
    body: DeleteBody
        | DeleteMultipleBody
        | EmptyBody
        | GetBody
        | GetAllBody
        | ListBody
        | SetBody
        | SetAllBody


}

const db = process.env.NODE_ENV === 'development' ? new DbLocal() : new Client()


export default async ({body}: DBApiInterface, res: NextApiResponse) => {

    switch (body.method) {
        case "empty": {
            await db.empty()
            break;
        }
        case "delete": {
            await db.delete(body.key)
            break;
        }
        case "deleteMultiple": {
            await db.deleteMultiple(...body.args)
            break;
        }
        case "get": {
            const value = await db.get(body.key)
            return res.json(value)
        }
        case "getAll": {
            const data = await db.getAll()
            return res.json(data)
        }
        case "list": {
            const data = await db.list(body.prefix)
            return res.json(data)
        }
        case "set": {
            await db.set(body.key, body.value)
            break;
        }
        case "setAll": {
            await db.setAll(body.obj)
            break;
        }
        default:
            throw new Error('Unsupported Method')
    }

    res.end({})
};
