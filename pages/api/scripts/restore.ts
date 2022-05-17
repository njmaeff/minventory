import {db} from "../lib/dbClient";
import {readFileSync} from "fs"
import path from "path";

const run = async () => {
    const [inFile,] = process.argv.slice(2)
    const input = JSON.parse(
        readFileSync(
            path.resolve(inFile),
            'utf8'
        )
    )
    await db.setAll(input)
};

run()
