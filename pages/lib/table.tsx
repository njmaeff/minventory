import React, {useState} from 'react';
import {
    Button,
    Form,
    Input,
    InputNumber,
    Modal,
    Space,
    Table,
    Typography
} from 'antd';
import {useOrm} from "./hooks/useOrm";
import {Doc} from "./types";

type Item = Doc<'inventory'> & { key: React.Key }

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
                                                       editing,
                                                       dataIndex,
                                                       title,
                                                       inputType,
                                                       record,
                                                       index,
                                                       children,
                                                       ...restProps
                                                   }) => {
    const inputNode = inputType === 'number' ? <InputNumber/> : <Input/>;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{margin: 0}}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export const EditableTable: React.FC<{ initialData: Item[] }> = ({initialData}) => {
    const [form] = Form.useForm<Omit<Item, 'key'>>();
    const [editingKey, setEditingKey] = useState('');
    const [removeItem, setRemoveItem] = useState<Item>(null)

    const [data, setData] = useState(initialData);
    const inventoryModel = useOrm('inventory')
    const writeInventory = inventoryModel.useWrite()
    const removeInventory = inventoryModel.useDelete()


    const isEditing = (record: Item) => record.id === editingKey;

    const edit = (record: Partial<Item>) => {
        form.setFieldsValue({
            name: '',
            description: '',
            sku: '',
            price: '0',
            ...record
        });
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (id) => {
        try {
            let row = (await form.validateFields()) as Item;
            const newData = [...data];
            const index = newData.findIndex(item => id === item.key);
            const {key, ...item} = newData[index];

            const update = {
                ...item,
                ...row,
            }

            writeInventory.mutate(update, {
                onSuccess: (id) => {
                    newData.splice(index, 1, {...update, key: id, id: id});
                    setData(newData);
                    setEditingKey('');
                },
            })

        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '25%',
            editable: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: '35%',
            editable: true,
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            editable: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_: any, record: Item) => {
                return <Space size={'small'}>
                    {isEditing(record) ? (
                        <>
                            <Typography.Link onClick={() => save(record.id)}>
                                Save
                            </Typography.Link>
                            <Typography.Link onClick={() => cancel()}>
                                Cancel
                            </Typography.Link>
                        </>
                    ) : (
                        <>
                            <Typography.Link disabled={editingKey !== ''}
                                             onClick={() => edit(record)}>
                                Edit
                            </Typography.Link>
                            <Typography.Link
                                onClick={() => setRemoveItem(record)}>
                                Remove
                            </Typography.Link>
                        </>
                    )}

                </Space>;
            },
        },
    ];

    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            <Button>Add Row</Button>
            <Form form={form} component={false}>
                <Modal
                    visible={!!removeItem}
                    onCancel={() => setRemoveItem(null)}
                    onOk={() => {
                        removeInventory.mutate(removeItem.id, {
                            onSuccess: () => {
                                setRemoveItem(null)
                                setData(prev => {
                                    const index = prev.findIndex((item) => item.id === removeItem.id)
                                    const clone = [...prev]
                                    clone.splice(index, 1)
                                    return clone
                                })
                            },
                        })
                    }}
                    maskClosable={false}
                    title={'Remove Item?'}
                >
                    {removeItem?.name}
                </Modal>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                        pageSize: 8,
                    }}
                />
            </Form>
        </>
    );
};
