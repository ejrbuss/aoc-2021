import { readFileSync } from "fs";
import { Challenges } from "./common.js";

import "./day1.js";
import "./day2.js";
import "./day3.js";
import "./day4.js";
import "./day5.js";
import "./day6.js";

const [_node, _script, spec, ...inputs] = process.argv;
const impl = Challenges[spec];

inputs.forEach((input) => {
	console.log(impl(readFileSync(`./input/${input}.txt`, "utf-8")));
});
