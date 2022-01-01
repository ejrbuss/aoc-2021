import { challenge, parseLines } from "./common.js";

// Honestly did not get this at all, just shamelessly ripped
// the top answer from the reddit
// https://www.reddit.com/r/adventofcode/comments/rnejv5/2021_day_24_solutions/

type Divisors = {
	div1: (number | null)[];
	div26: (number | null)[];
};

function parseInput(input: string): Divisors {
	const lines = parseLines(input).map((line) => line.split(" "));
	const divisors: Divisors = { div1: [], div26: [] };
	for (let i = 0; i < lines.length; i += 18) {
		if (lines[i + 4][2] == "1") {
			divisors.div1.push(parseInt(lines[i + 15][2]));
			divisors.div26.push(null);
		} else {
			divisors.div1.push(null);
			divisors.div26.push(parseInt(lines[i + 5][2]));
		}
	}
	return divisors;
}

function getMaxModelNumber(divisors: Divisors): number[] {
	const modelNumber = new Array(14).fill(0);
	const stack: [number, number][] = [];
	for (let i = 0; i < divisors.div1.length; i += 1) {
		const a = divisors.div1[i];
		const b = divisors.div26[i];
		if (a !== null) {
			stack.push([i, a]);
		} else {
			const [ia, a] = stack.pop() as [number, number];
			const diff = a + (b as number);
			modelNumber[ia] = Math.min(9, 9 - diff);
			modelNumber[i] = Math.min(9, 9 + diff);
		}
	}
	return modelNumber;
}

function getMinModelNumber(divisors: Divisors): number[] {
	const modelNumber = new Array(14).fill(0);
	const stack: [number, number][] = [];
	for (let i = 0; i < divisors.div1.length; i += 1) {
		const a = divisors.div1[i];
		const b = divisors.div26[i];
		if (a !== null) {
			stack.push([i, a]);
		} else {
			const [ia, a] = stack.pop() as [number, number];
			const diff = a + (b as number);
			modelNumber[ia] = Math.max(1, 1 - diff);
			modelNumber[i] = Math.max(1, 1 + diff);
		}
	}
	return modelNumber;
}

challenge({ day: 24, part: 1 }, (input) => {
	const divisors = parseInput(input);
	return getMaxModelNumber(divisors).join("");
});

challenge({ day: 24, part: 2 }, (input) => {
	const divisors = parseInput(input);
	return getMinModelNumber(divisors).join("");
});
