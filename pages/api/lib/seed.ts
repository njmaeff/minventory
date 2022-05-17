import faker from "@faker-js/faker"
import {DbLocal} from "./dbLocal";
import {Client} from "@replit/database";

faker.seed(19)
const db = process.env.NODE_ENV === 'development' ? new DbLocal() : new Client()


const seed = async () => {

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
