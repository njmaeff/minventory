import {Meta} from "./lib/meta";
import {Page} from "./lib/page";
import {EditableTable} from "./lib/table";
import {useOrm} from "./lib/hooks/useOrm";
import {Spinner} from "./lib/spinner";

export default () => {
    const inventoryModel = useOrm('inventory')
    const {data, ...inventoryGetAll} = inventoryModel.useGetAll()

    return <>
        <Meta title={'Inventory'}/>
        <Page>
            {inventoryGetAll.isSuccess ?
                <EditableTable
                    initialData={data.sort((a, b) => a.date <= b.date ? 1 : -1)}/> :
                <Spinner/>}
        </Page>
    </>
};
