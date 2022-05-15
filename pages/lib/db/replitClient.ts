export interface ReplitClient {
    get(key: string, options?: { raw?: boolean }): Promise<unknown>;

    set(key: string, value: any): Promise<this>;

    delete(key: string): Promise<this>;

    list(prefix?: string): Promise<string[]>;

    empty(): Promise<this>;

    getAll(): Promise<Record<any, any>>;

    setAll(obj: Record<any, any>): Promise<this>;

    deleteMultiple(...args: string[]): Promise<this>;
}
