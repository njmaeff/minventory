export interface Models {
    inventory: {
        name: string
        date: number
        description: string
        sku: string
        price: string
    }

    history: {
        comment?: string
        date: number
        model: keyof Models
        ref?: string
        record?: Models[keyof Models] & { key: string }
        operation: 'edit' | 'create' | 'delete'
    }
}

export type Doc<T extends keyof Models> = Models[T] & { key: string }
