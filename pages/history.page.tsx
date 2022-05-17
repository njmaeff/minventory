import {Meta} from "./lib/meta";
import {Page} from "./lib/page";
import {orm, useOrm} from "./lib/hooks/useOrm";
import {Spinner} from "./lib/spinner";
import {message, Popconfirm, Space, Table, Typography} from "antd";
import React, {useState} from "react";
import {Doc} from "./lib/types";

type Item = Doc<"history">

export default () => {
    const historyModel = useOrm('history')
    const [data, setData] = useState<Item[]>([])
    const historyGetAll = historyModel.useGetAll({
        onSuccess: data => setData(data.sort((a, b) => a.date <= b.date ? 1 : -1))
    })

    return <>
        <Meta title={'History'}/>
        <Page>
            {historyGetAll.isSuccess ? <Table
                pagination={{
                    pageSize: 8,
                }}
                columns={[
                    {
                        title: 'Operation',
                        dataIndex: 'operation'
                    },
                    {
                        title: 'Model',
                        dataIndex: 'model'
                    },
                    {
                        title: 'Ref',
                        dataIndex: 'ref'
                    },
                    {
                        title: 'Comment',
                        dataIndex: 'comment'
                    },
                    {
                        title: 'Date',
                        dataIndex: 'date',
                        render: (_, record: Item) => {
                            return new Date(record.date).toLocaleDateString()
                        }
                    },
                    {
                        title: 'Action',
                        dataIndex: 'action',
                        render: (_: any, record: Item) => {
                            return <Space size={'small'}>
                                <Popconfirm
                                    title={'Are you sure you wish to revert this item?'}
                                    onConfirm={async () => {
                                        const model = orm.collection(record.model)
                                        let revertRecord = {
                                            model: record.model,
                                            ref: record.ref,
                                            date: new Date().getTime(),
                                            comment: 'Revert',
                                        } as Item;

                                        const currentItem = await model.get(record.record?.key)

                                        switch (record.operation) {
                                            case "create":
                                                revertRecord.operation = 'delete'
                                                revertRecord.comment = 'Revert create'
                                                revertRecord.record = currentItem
                                                await model.delete(currentItem.key)
                                                break;
                                            case "edit":
                                                revertRecord.operation = 'edit'
                                                revertRecord.comment = 'Revert edit'
                                                revertRecord.record = currentItem
                                                await model.write(record.record)
                                                break;

                                            case "delete":
                                                revertRecord.operation = 'create'
                                                revertRecord.comment = 'Revert delete'
                                                await model.write(record.record)
                                                break;
                                        }

                                        const key = await historyModel.write(revertRecord)
                                        setData((prev) => [{
                                            ...revertRecord,
                                            key
                                        }, ...prev])
                                        message.success("Item reverted")
                                    }}
                                >
                                    <Typography.Link
                                        onClick={(e) => e.preventDefault()}>
                                        Revert
                                    </Typography.Link>
                                </Popconfirm>
                            </Space>;
                        },
                    }
                ]}
                dataSource={data}
            >

            </Table> : <Spinner/>}
        </Page>
    </>
};
