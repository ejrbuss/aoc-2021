import { readdirSync, readFileSync } from "fs";
import { Challenges } from "./common.js";
// Import days
for (const file of readdirSync("./out")) {
    if (file.startsWith("day") && file.endsWith(".js")) {
        await import(`./${file}`);
    }
}
const [_node, _script, spec, ...inputs] = process.argv;
const impl = Challenges[spec];
inputs.forEach((input) => {
    console.log(impl(readFileSync(`./input/${input}.txt`, "utf-8")));
});
