import {useState} from "react";

type KeyLike = string | number;

export class LocalStorage<DataType = any> {
    set(key: KeyLike, data: DataType) {
        this.data.set(key, data);
        this.save();
    }

    removeItem(key: KeyLike) {
        this.data.delete(key);
        this.save()
    }

    values(): DataType[] {
        return Array.from(this.data.values())
    }

    length(): number {
        return this.data.size
    }

    hasKey(key: KeyLike) {
        return this.data.has(key);
    }

    get(key: KeyLike) {
        return this.data.get(key)
    }

    constructor(private storageKey: string) {

        if (global.window) {
            this.data = new Map(JSON.parse(
                localStorage.getItem(
                    storageKey
                )) ?? []
            );
        } else {
            this.data = new Map();
        }

        const [data, updateData] = useState({count: this.data.size})
        const count = data.count
        this.save = () => {
            localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.data.entries())))
            updateData({count: this.data.size});
        }

        this.count = count;

    }

    count: number;
    save: () => void;
    private data: Map<KeyLike, DataType>;
}
