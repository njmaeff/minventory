import Client from "@replit/database";
import {DbLocal} from "./dbLocal";

export const db = process.env.NODE_ENV === 'development'
    ? new DbLocal()
    //@ts-expect-error: typings are incorrect
    : new Client()
