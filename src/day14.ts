import { challenge, max, min, parseLines } from "./common.js";

type Rules = Record<string, string>;
type CharCounts = Record<string, number>;

function parseInput(input: string): {
	template: string;
	rules: Rules;
} {
	const lines = parseLines(input);
	const template = lines.shift() as string;
	const rules: Rules = {};
	for (const line of lines) {
		const [left, right] = line.split("->").map((part) => part.trim());
		rules[left] = right;
	}
	return { template, rules };
}

function checksum(template: string, rules: Rules, generations: number) {
	const pairCharCounts: Record<string, CharCounts> = {};

	function recurse(pair: string, generation: number): CharCounts {
		const key = pair + "_" + generation;
		if (key in pairCharCounts) {
			return pairCharCounts[key];
		}
		if (generation === generations || !(pair in rules)) {
			return (pairCharCounts[key] = { [pair[0]]: 1 });
		}
		const insertion = rules[pair];
		const pair1 = pair[0] + insertion;
		const pair2 = insertion + pair[1];
		const charCounts = addCounts(
			recurse(pair1, generation + 1),
			recurse(pair2, generation + 1)
		);
		return (pairCharCounts[key] = charCounts);
	}

	let charCounts: CharCounts = {};
	for (let i = 0; i + 1 < template.length; i += 1) {
		const pair = template.substring(i, i + 2);
		charCounts = addCounts(charCounts, recurse(pair, 0));
	}
	charCounts = addCounts(charCounts, { [template[template.length - 1]]: 1 });
	const counts = Object.values(charCounts);
	return max(counts) - min(counts);
}

function addCounts(charCounts1: CharCounts, charCounts2: CharCounts) {
	const sumCharCounts: CharCounts = {};
	for (const char in charCounts1) {
		sumCharCounts[char] = (sumCharCounts[char] ?? 0) + charCounts1[char];
	}
	for (const char in charCounts2) {
		sumCharCounts[char] = (sumCharCounts[char] ?? 0) + charCounts2[char];
	}
	return sumCharCounts;
}

challenge({ day: 14, part: 1 }, (input) => {
	let { template, rules } = parseInput(input);
	return checksum(template, rules, 10);
});

challenge({ day: 14, part: 2 }, (input) => {
	let { template, rules } = parseInput(input);
	return checksum(template, rules, 40);
});
