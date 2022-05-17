import {ReplitClient} from "./replitClient";
import {v4 as uuidV4} from "uuid"

export class Orm {

    collection(collection: string) {
        if (/\//.test(collection)) {
            throw new Error('You may not use a forward slash (/) in a collection name')
        }
        return new Orm(
            this.client,
            this.prefix(collection)
        );
    }

    async delete(key: string) {
        await this.client.delete(this.prefix(key));
        return this
    }

    async deleteMultiple(...keys: string[]) {
        await this.client.deleteMultiple(...keys.map((key) => this.prefix(key)));
        return this
    }

    async get(key: string) {
        return this.client.get(this.prefix(key));
    }

    async getAll() {
        return this.client.getAll()

    }

    async list(prefix?: string) {
        const collectionPrefix = this.prefix(prefix)
        const list = await this.client.list(collectionPrefix)
        return list.map((key) => key.replace(collectionPrefix, ''))
    }

    async write({id, ...value}: any) {
        id = id ?? uuidV4()
        await this.client.set(this.prefix(id), {id, ...value});
        return id
    }

    protected prefix(...paths) {
        return [this.namespace, ...paths].join(`/`)
    }

    constructor(
        private client: ReplitClient,
        private namespace = '') {

    }
}

