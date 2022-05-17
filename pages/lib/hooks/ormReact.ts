import {Orm} from "../db/orm";
import {useMutation, useQuery, UseQueryOptions} from "react-query";

export type Return<T extends (...args: any[]) => any> = Awaited<ReturnType<T>>
export type Args<T extends (...args: any[]) => any> = Parameters<T>[0]

export class OrmReact<T extends Record<string, any>> extends Orm<T> {
    useGet(key: string, opts: UseQueryOptions<Return<this['get']>>) {
        return useQuery(this.prefix(key), () => this.get(key), opts)
    }


    useWrite() {
        // @ts-expect-error: unsure why this isn't compiling since we are
        // awaiting the promise type from `this.write`.
        return useMutation<Return<this['write']>, any, Args<this['write']>>(this.prefix(), (value) => this.write(value))
    }


    useDelete() {
        return useMutation<void, any, Args<this['delete']>>((key: string) => this.delete(key))
    }


    useList(opts?: UseQueryOptions<Return<this['list']>>) {
        return useQuery(this.prefix(), () => this.list(), opts)
    }

    useGetAll(opts?: UseQueryOptions<Return<this['getAll']>>) {
        return useQuery(this.prefix(), () => this.getAll(), opts)
    }

    useDeleteMultiple() {
        return useMutation<void, any, Args<this['deleteMultiple']>>((...args) => this.deleteMultiple(...args))
    }

    override collection<P extends keyof T>(collection: P) {
        this.validateCollection(collection)
        return new OrmReact<T[P]>(
            this.client,
            this.prefix(collection)
        );
    }

}
