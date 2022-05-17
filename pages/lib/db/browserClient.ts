import {ReplitClient} from "./types";
import axios from "axios";

export const sendData = (data) => {
    return axios.post('/api/db', data)
};

export class BrowserClient implements ReplitClient {

    async delete(key: string): Promise<this> {
        await sendData({
            method: 'delete',
            key
        })
        return this
    }

    async deleteMultiple(...args: string[]): Promise<this> {
        await sendData({
            method: 'deleteMultiple',
            args
        })
        return this
    }

    async empty(): Promise<this> {
        await sendData({
            method: 'empty'
        })
        return this
    }

    async get(key: string) {
        const {data} = await sendData({
            method: 'get',
            key
        })
        return data
    }

    async getAll(): Promise<Record<any, any>> {
        const {data} = await sendData({
            method: 'getAll'
        })
        return data
    }

    async list(prefix?: string): Promise<string[]> {
        const {data: keys} = await sendData({
            method: 'list',
            prefix
        })
        return keys
    }

    async set(key: string, value: any): Promise<this> {
        await sendData({
            method: 'set',
            key,
            value
        })
        return this
    }

    async setAll(obj: Record<any, any>) {
        await sendData({
            method: 'setAll',
            obj
        })
        return this
    }

}
