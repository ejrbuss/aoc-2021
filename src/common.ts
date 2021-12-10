export type ChallengeSpec = {
	day: number;
	part: number;
};

export type ChallengeImpl = (input: string) => any;

export const Challenges: Record<string, ChallengeImpl> = {};

export function challenge(spec: ChallengeSpec, impl: ChallengeImpl) {
	Challenges[spec.day + "." + spec.part] = impl;
}

export function parseLines(input: string): string[] {
	return input.trim().split("\n");
}

export function parseNumbers(input: string, sep = "\n"): number[] {
	return input
		.trim()
		.split(sep)
		.map((line) => parseInt(line));
}

export function parseRegExp(input: string, regExp: RegExp): string[][] {
	return parseLines(input).map((line) => line.match(regExp) as string[]);
}

export function chunk<T>(array: T[], n: number): T[][] {
	const length = array.length;
	const chunks: T[][] = [];
	let chunk: T[] = [];
	for (let i = 0; i < length; i += 1) {
		chunk.push(array[i]);
		if (chunk.length === n) {
			chunks.push(chunk);
			chunk = [];
		}
	}
	if (chunk.length) {
		chunks.push(chunk);
	}
	return chunks;
}

export function zipWith<A, B, C>(
	array1: A[],
	array2: B[],
	f: (a: A, b: B, i: number) => C
): C[] {
	const length = Math.max(array1.length, array2.length);
	const acc: C[] = [];
	for (let i = 0; i < length; i += 1) {
		acc.push(f(array1[i], array2[i], i));
	}
	return acc;
}

export function min(array: number[]): number {
	let min = Infinity;
	for (const value of array) {
		min = Math.min(value, min);
	}
	return min;
}

export function max(array: number[]): number {
	let max = -Infinity;
	for (const value of array) {
		max = Math.max(value, max);
	}
	return max;
}
