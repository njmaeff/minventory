import {db} from "../lib/dbClient";
import {writeFileSync} from "fs"
import path from "path";

const run = async () => {
    const [outFile,] = process.argv.slice(2)
    const dump = await db.getAll()
    writeFileSync(
        path.resolve(outFile),
        JSON.stringify(dump, null, 2),
        'utf8'
    )
};

run()
