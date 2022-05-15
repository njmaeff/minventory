import {ReplitClient} from "./replitClient";

export class Api implements ReplitClient {

    collection(collection: string) {
        if (/\//.test(collection)) {
            throw new Error('You may not use a forward slash (/) in a collection name')
        }
        return new Api(
            this.client,
            this.prefix(collection)
        );
    }

    async delete(key: string) {
        await this.client.delete(this.prefix(key));
        return this
    }

    async deleteMultiple(...args: string[]) {
        await this.client.deleteMultiple(...args.map((arg) => this.prefix(arg)));
        return this
    }

    async empty() {
        await this.client.empty()
        return this
    }

    async get(key: string) {
        return this.client.get(this.prefix(key));
    }

    async getAll() {
        return this.client.getAll()

    }

    list(prefix?: string) {
        return this.client.list(this.prefix(prefix))
    }

    async set(key: string, value: any) {
        await this.client.set(this.prefix(key), value);
        return this
    }

    async setAll(obj: Record<any, any>) {
        const prefixedObject = {}
        for (const [key, value] of Object.entries(obj)) {
            prefixedObject[this.prefix(key)] = value

        }
        await this.client.setAll(prefixedObject)
        return this
    }

    protected prefix(...paths) {
        return [this.namespace, ...paths].join(`/`)
    }

    constructor(
        private client,
        private namespace = '') {

    }
}

