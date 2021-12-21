import { challenge, parseLines } from "./common.js";

type SnailNumber = [SnailNumber | number, SnailNumber | number];
type Path = number[];

function add(snailNumber1: SnailNumber, snailNumber2: SnailNumber) {
	return reduce([snailNumber1, snailNumber2]);
}

function reduce(snailNumber: SnailNumber): SnailNumber {
	const frontier: Path[] = [];

	// If any pair is nested inside four pairs, the leftmost such pair explodes.
	frontier.push([]);
	while (frontier.length) {
		const path = frontier.pop() as number[];
		const nestedInside = path.length;
		const value = getAt(snailNumber, path);
		if (typeof value !== "number" && nestedInside === 4) {
			return reduce(explode(snailNumber, path));
		}
		if (typeof value === "number") {
			continue;
		}
		frontier.push([...path, 1], [...path, 0]);
	}

	// If any regular number is 10 or greater, the leftmost such regular
	// number splits.
	frontier.push([]);
	while (frontier.length) {
		const path = frontier.pop() as number[];
		const value = getAt(snailNumber, path);
		if (typeof value === "number" && value >= 10) {
			return reduce(split(snailNumber, path));
		}
		if (typeof value === "number") {
			continue;
		}
		frontier.push([...path, 1], [...path, 0]);
	}
	return snailNumber;
}

function explode(snailNumber: SnailNumber, path: Path): SnailNumber {
	const [left, right] = getAt(snailNumber, path) as [number, number];
	const leftPath = firstNumberLeftOfPath(snailNumber, path);
	const rightPath = firstNumberRightOfPath(snailNumber, path);
	let newSnailNumber = snailNumberWith(snailNumber, path, 0);
	if (leftPath) {
		const leftPathValue = getAt(snailNumber, leftPath) as number;
		newSnailNumber = snailNumberWith(
			newSnailNumber,
			leftPath,
			leftPathValue + left
		);
	}
	if (rightPath) {
		const rightPathValue = getAt(snailNumber, rightPath) as number;
		newSnailNumber = snailNumberWith(
			newSnailNumber,
			rightPath,
			rightPathValue + right
		);
	}
	return newSnailNumber;
}

function split(snailNumber: SnailNumber, path: Path): SnailNumber {
	const value = getAt(snailNumber, path) as number;
	return snailNumberWith(snailNumber, path, [
		Math.floor(value / 2),
		Math.ceil(value / 2),
	]);
}

function getAt(snailNumber: SnailNumber, path: Path): SnailNumber | number {
	let intermediate = snailNumber;
	for (const key of path) {
		intermediate = intermediate[key] as SnailNumber;
	}
	return intermediate;
}

function snailNumberWith(
	snailNumber: SnailNumber,
	path: Path,
	value: SnailNumber | number
): SnailNumber {
	const pathUpTo = path.slice(0, path.length - 1);
	const pathEnd = path[path.length - 1];
	const newSnailNumber: SnailNumber | number = [...snailNumber];
	let intermediate = newSnailNumber as SnailNumber;
	for (const key of pathUpTo) {
		intermediate[key] = [...(intermediate[key] as SnailNumber)];
		intermediate = intermediate[key] as SnailNumber;
	}
	intermediate[pathEnd] = value;
	return newSnailNumber;
}

function firstNumberLeftOfPath(
	snailNumber: SnailNumber,
	path: Path
): Path | undefined {
	let leftPath: Path | undefined;
	const pathKey = JSON.stringify(path);
	for (const [intermediate, subPath] of snailNumberIter(snailNumber)) {
		if (arrayPrefixMatch(path, subPath)) {
			return leftPath;
		}
		if (typeof intermediate === "number") {
			leftPath = subPath;
		}
	}
	return leftPath;
}

function firstNumberRightOfPath(
	snailNumber: SnailNumber,
	path: Path
): Path | undefined {
	let leftPath: Path | undefined;
	const snailNumbersAndPaths = [...snailNumberIter(snailNumber)];
	for (const [intermediate, subPath] of snailNumbersAndPaths.reverse()) {
		if (arrayPrefixMatch(path, subPath)) {
			return leftPath;
		}
		if (typeof intermediate === "number") {
			leftPath = subPath;
		}
	}
	return leftPath;
}

function snailNumberIter(
	snailNumber: SnailNumber
): Generator<[SnailNumber | number, Path]> {
	function* recurse(
		intermediate: SnailNumber | number,
		path: Path
	): Generator<[SnailNumber | number, Path]> {
		yield [intermediate, path];
		if (typeof intermediate !== "number") {
			const [left, right] = intermediate;
			const leftIterator = recurse(left, [...path, 0]);
			for (const subLeft of leftIterator) {
				yield subLeft;
			}
			const rightIterator = recurse(right, [...path, 1]);
			for (const subRight of rightIterator) {
				yield subRight;
			}
		}
	}
	return recurse(snailNumber, []);
}

function magnitude(snailNumber: SnailNumber | number): number {
	if (typeof snailNumber === "number") {
		return snailNumber;
	} else {
		const [left, right] = snailNumber;
		return 3 * magnitude(left) + 2 * magnitude(right);
	}
}

function arrayPrefixMatch<T>(prefixArray: T[], array: T[]): boolean {
	for (const i in prefixArray) {
		if (prefixArray[i] !== array[i]) {
			return false;
		}
	}
	return true;
}

function parseInput(input: string): SnailNumber[] {
	const snailNumbers: SnailNumber[] = [];
	for (const line of parseLines(input)) {
		snailNumbers.push(JSON.parse(line));
	}
	return snailNumbers;
}

challenge({ day: 18, part: 1 }, (input) => {
	const snailNumbers = parseInput(input);
	let sum = snailNumbers.shift() as SnailNumber;
	for (const snailNumber of snailNumbers) {
		sum = add(sum, snailNumber);
	}
	return magnitude(sum);
});

challenge({ day: 18, part: 2 }, (input) => {
	const snailNumbers = parseInput(input);
	let largestMagnitude = 0;
	for (const i in snailNumbers) {
		for (const j in snailNumbers) {
			if (i === j) {
				continue;
			}
			largestMagnitude = Math.max(
				largestMagnitude,
				magnitude(add(snailNumbers[i], snailNumbers[j]))
			);
		}
	}
	return largestMagnitude;
});
