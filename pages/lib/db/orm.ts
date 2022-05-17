import {ReplitClient} from "./replitClient";
import {v4 as uuidV4} from "uuid"

export class Orm<T extends Record<string, any>, Doc extends { id?: string } = (T & { id: string })> {

    collection<P extends keyof T>(collection: P) {
        this.validateCollection(collection)
        return new Orm<T[P]>(
            this.client,
            this.prefix(collection)
        );
    }

    async delete(key: string) {
        await this.client.delete(this.prefix(key));
    }

    async deleteMultiple(...keys: string[]) {
        await this.client.deleteMultiple(...keys.map((key) => this.prefix(key)));
    }

    async get(key: string): Promise<Doc> {
        return this.client.get(this.prefix(key));
    }

    async getAll(): Promise<Doc[]> {
        const keys = await this.list();
        return Promise.all(keys.map((key) => this.get(key)))
    }

    async list(): Promise<string[]> {
        const collectionPrefix = this.prefix()
        const list = await this.client.list(collectionPrefix)
        return list.map((key) => key.replace(`${collectionPrefix}/`, ''))
    }

    async write({id, ...value}: Doc) {
        id = id ?? uuidV4()
        await this.client.set(this.prefix(id), {id, ...value});
        return id
    }

    protected validateCollection(collection) {
        if (/\//.test(collection)) {
            throw new Error('You may not use a forward slash (/) in a collection name')
        }
    }

    protected prefix(...paths) {
        return [this.namespace, ...paths].join(`/`)
    }

    constructor(
        protected client: ReplitClient,
        private namespace = '') {

    }
}

