import {ReplitClient} from "../../lib/db/replitClient";
import path from "path";
import {readFileSync, writeFileSync} from "fs"

const dbFile = path.join(process.cwd(), 'db.json')
const readDBFile = () => {
    try {
        JSON.parse(readFileSync(dbFile, 'utf8'))
    } catch (e) {
        return {}
    }
}
const writeDBFile = (file) => writeFileSync(dbFile, JSON.stringify(file), 'utf8')

export class DbLocal implements ReplitClient {
    async delete(key: string) {
        const data = readDBFile();
        delete data[key]
        writeDBFile(data)
        return this;
    }

    async deleteMultiple(...args: string[]) {
        const data = readDBFile();
        args.forEach((arg) => delete data[arg])
        writeDBFile(data)
        return this
    }

    async empty() {
        writeDBFile({})
        return this
    }

    async get(key: string) {
        const data = readDBFile();
        return data[key]
    }

    async getAll() {
        return readDBFile()
    }

    async list(prefix?: string) {
        const data = readDBFile()
        return Array.from(
            Object.keys(data).filter((key) => key.startsWith(prefix))
        )
    }

    async set(key: string, value: any) {
        const data = readDBFile()
        data[key] = value;
        writeDBFile(data)
        return this
    }

    async setAll(obj: Record<any, any>): Promise<this> {
        writeDBFile(obj)
        return this
    }

}
