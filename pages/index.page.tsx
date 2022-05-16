import {Meta} from "./lib/meta";
import {Page} from "./lib/page";
import {EditableTable} from "./lib/table";

export default () => {

    return <>
        <Meta title={'Inventory'}/>
        <Page>
            <EditableTable/>
        </Page>
    </>
};
