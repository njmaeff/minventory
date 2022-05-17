import {Meta} from "./lib/meta";
import {Page} from "./lib/page";
import {InventoryTable} from "./lib/inventoryTable";
import {useOrm} from "./lib/hooks/useOrm";
import {Spinner} from "./lib/spinner";

export default () => {
    const inventoryModel = useOrm('inventory')
    const {data, ...inventoryGetAll} = inventoryModel.useGetAll()

    return <>
        <Meta title={'Inventory'}/>
        <Page>
            {inventoryGetAll.isSuccess ?
                <InventoryTable
                    initialData={data.sort((a, b) => a.date <= b.date ? 1 : -1)}/> :
                <Spinner/>}
        </Page>
    </>
};
