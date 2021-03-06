import React, {useState} from 'react';
import {
    Button,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Space,
    Table,
    Typography
} from 'antd';
import {useOrm} from "./hooks/useOrm";
import {Doc} from "./types";
import {css} from '@emotion/react';

type Item = Doc<'inventory'>

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

export const InventoryTable: React.FC<{ initialData: Item[] }> = ({initialData}) => {
    const [form] = Form.useForm<Omit<Item, 'key'>>();
    const [editingKey, setEditingKey] = useState('');
    const [removeItem, setRemoveItem] = useState<Item>(null)
    const [addItem, setAddItem] = useState(false)

    const [data, setData] = useState(initialData);
    const inventoryModel = useOrm('inventory')
    const historyModel = useOrm('history')

    const isEditing = (record: Item) => record.key === editingKey;

    const edit = (record: Partial<Item>) => {
        form.setFieldsValue({
            name: '',
            description: '',
            sku: '',
            price: '0',
            ...record
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (id) => {
        try {
            let row = (await form.validateFields()) as Item;
            const newData = [...data];
            const index = newData.findIndex(item => id === item.key);
            const previousRecord = newData[index];
            const update = {
                ...previousRecord,
                ...row,
                date: new Date().getTime()
            }

            await inventoryModel.write(update)
            await historyModel.write({
                record: previousRecord,
                operation: 'edit',
                date: update.date,
                model: 'inventory',
                ref: update.name,
                comment: `Edit Item ${update.name}`
            })
            newData.splice(index, 1, update);
            setData(newData);
            setEditingKey('');
            message.success('Item Saved')

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
            title: 'Action',
            dataIndex: 'action',
            render: (_: any, record: Item) => {
                return <Space size={'small'}>
                    {isEditing(record) ? (
                        <>
                            <Typography.Link onClick={() => save(record.key)}>
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
            <Button type={'primary'} css={
                css`
                    margin: 0.5rem;
                `
            } onClick={() => setAddItem(true)}>Add Item</Button>
            <AddItemModal
                visible={addItem}
                onCancel={() => setAddItem(false)}
                onOk={async (item) => {
                    const date = new Date().getTime();
                    const key = await inventoryModel.write({
                        ...item,
                        date
                    })
                    const record = {...item, key}
                    await historyModel.write({
                        comment: `New Item ${record.name}`,
                        ref: record.name,
                        date,
                        model: 'inventory',
                        operation: 'create'
                    })
                    setData(prev => [record, ...prev])
                    setAddItem(false)
                    message.success('Item Added')
                }}
                title={'Add New Item'}
            />
            <CommentModal
                visible={!!removeItem}
                onCancel={() => setRemoveItem(null)}
                onOk={async ({comment}) => {
                    await inventoryModel.delete(removeItem.key)
                    await historyModel.write({
                        record: removeItem,
                        model: 'inventory',
                        date: new Date().getTime(),
                        ref: removeItem.name,
                        comment,
                        operation: 'delete'
                    })
                    setRemoveItem(null)
                    setData(prev => {
                        const index = prev.findIndex((item) => item.key === removeItem.key)
                        const clone = [...prev]
                        clone.splice(index, 1)
                        return clone
                    })
                    message.success('Item Removed')
                }}
                title={`Remove ${removeItem?.name}?`}
            />
            <Form form={form} component={false}>
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


export type CommentModalType = { comment: string }
export const CommentModal: React.FC<{
    visible: boolean,
    onCancel: () => void,
    onOk: (item: CommentModalType) => void,
    title: string;
}> = ({
          visible,
          onCancel,
          onOk,
          title
      }) => {

    const [form] = Form.useForm<CommentModalType>();

    return <Modal
        visible={visible}
        onCancel={onCancel}
        onOk={async () => {
            const row = await form.validateFields()
            form.resetFields()
            onOk(row)
        }}
        maskClosable={false}
        title={title}
    >
        <Form form={form}>
            <Form.Item name={'comment'} label={'Comment'}
                       rules={[{required: true}]}>
                <Input.TextArea/>
            </Form.Item>
        </Form>
    </Modal>
};

export const AddItemModal: React.FC<{
    visible: boolean,
    onCancel: () => void,
    onOk: (item: Item) => void,
    title: string;
}> = ({
          onCancel,
          onOk,
          title,
          visible
      }) => {

    const [form] = Form.useForm<Item>()

    return <Modal
        visible={visible}
        onCancel={onCancel}
        onOk={async () => {
            const row = await form.validateFields()
            form.resetFields()
            onOk(row)
        }}
        maskClosable={false}
        title={title}
    >
        <Form form={form}>
            <Form.Item name={'name'} label={'Name'}
                       rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name={'description'} label={'Description'}
                       rules={[{required: true}]}>
                <Input.TextArea/>
            </Form.Item>
            <Form.Item name={'sku'} label={'SKU'}
                       rules={[{required: true}]}>
                <Input/>
            </Form.Item>
            <Form.Item name={'price'} label={'Price'}
                       rules={[{required: true}]}>
                <Input/>
            </Form.Item>
        </Form>
    </Modal>
};
