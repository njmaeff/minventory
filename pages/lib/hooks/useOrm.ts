import {OrmReact} from "./ormReact";
import {BrowserClient} from "../db/browserClient";
import {Models} from "../types";

const orm = new OrmReact<Models>(new BrowserClient())
export const useOrm = <P extends keyof Models>(collection: P) => orm.collection(collection)
