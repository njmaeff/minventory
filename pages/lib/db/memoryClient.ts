import {ReplitClient} from "./replitClient";

export class MemoryClient implements ReplitClient {
    async delete(key: string) {
        this.store.delete(key)
        return this;
    }

    async deleteMultiple(...args: string[]) {
        args.forEach((arg) => this.store.delete(arg))
        return this
    }

    async empty() {
        this.store.clear();
        return this
    }

    async get(key: string) {
        return this.store.get(key)
    }

    async getAll() {
        const result = {}
        for (const [key, value] of this.store.entries()) {
            result[key] = value
        }
        return result
    }

    async list(prefix?: string): Promise<string[]> {
        const keys = Array.from(this.store.keys())
        if (prefix) {
            return keys.filter((key) => key.startsWith(prefix));
        } else {
            return keys
        }
    }

    async set(key: string, value: any) {
        this.store.set(key, value)
        return this
    }

    async setAll(obj: Record<string, string>) {
        for (const [key, value] of Object.entries(obj)) {
            this.store.set(key, value)
        }
        return this;
    }

    private store: Map<string, string>

}
