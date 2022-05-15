import {Api} from "../db/api";
import {useMutation, useQuery} from "react-query";

export class ApiReact<T, P extends keyof T> extends Api {
    useGet(key: string, opts) {
        return useQuery(this.prefix(key), () => this.get(key), opts)
    }


    useSet(key: string, opts) {
        return useMutation(this.prefix(key), (value) => this.set(key, value), opts)
    }


    useDelete(opts) {
        return useMutation((key: string) => this.delete(key), opts)
    }


    useList({prefix, opts}) {
        return useQuery(this.prefix(prefix), () => this.list(prefix), opts)
    }


    useEmpty(opts) {
        return useMutation((key: string) => this.empty(), opts)
    }


    useGetAll(opts) {
        return useQuery(this.prefix(), () => this.getAll(), opts)
    }


    useSetAll(opts) {
        return useMutation((obj: Record<string, any>) => this.setAll(obj), opts)
    }


    useDeleteMultiple(opts) {
        return useMutation((args: string[]) => this.deleteMultiple(...args), opts)
    }

}
