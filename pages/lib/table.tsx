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

export const EditableTable = () => {
    const [form] = Form.useForm<Omit<Item, 'key'>>();
    const [editingKey, setEditingKey] = useState('');
    const [removeItem, setRemoveItem] = useState(null)

    const inventoryModel = useOrm('inventory')
    const [data, setData] = useState([]);
    const inventoryGetAll = inventoryModel.useGetAll({
        onSuccess: data => setData(data.map((item) => ({
            ...item,
            key: item.id
        })))
    })

    const writeInventory = inventoryModel.useWrite()


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
            const row = (await form.validateFields()) as Item;

            const newData = [...data];
            const index = newData.findIndex(item => id === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
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
                        <span>
            <Typography.Link onClick={() => save(record.id)}>
              Save
            </Typography.Link>
            <Typography.Link onClick={() => cancel()}>
              Cancel
            </Typography.Link>
          </span>
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
                    visible={removeItem}
                    onCancel={() => setRemoveItem(null)}
                    onOk={() => {

                        setRemoveItem(null)
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
                    }}
                />
            </Form>
        </>
    );
};
