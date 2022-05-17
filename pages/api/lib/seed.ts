import faker from "@faker-js/faker"
import {DbLocal} from "./dbLocal";
import {Client} from "@replit/database";
import {Orm} from "../../lib/db/orm";
import {Models} from "../../lib/types";
import {ReplitClient} from "../../lib/db/replitClient";
import {range} from "lodash";

faker.seed(19)

const client = process.env.NODE_ENV === 'development' ? new DbLocal() : new Client()
const orm = new Orm<Models>(client as ReplitClient)

const makeInventory = () => ({
    name: faker.vehicle.vehicle(),
    description: faker.lorem.lines(1),
    date: faker.date.past(1).getTime(),
    sku: faker.vehicle.model(),
    price: faker.commerce.price(30000, 80000, 2,)
})

const seed = async () => {

    const inventory = orm.collection('inventory')
    const history = orm.collection('history');

    await Promise.all(
        range(25).map(() => {
            inventory.write(makeInventory())
        })
    );

    await Promise.all(
        range(10).map(() => {

            return history.write({
                comment: faker.lorem.lines(3),
                date: faker.date.past(1).getTime(),
                model: 'inventory',
                operation: 'delete',
                record: {
                    ...makeInventory(),
                    key: faker.datatype.uuid()
                }
            })
        })
    );
};

export const run = async () => {
    try {
        await seed()
        process.exit(0)
    } catch (e) {
        console.error(e);
        process.exit(1)
    }
};

if (require.main === module) {
    run()
}
