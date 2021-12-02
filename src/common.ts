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

export function parseNumbers(input: string): number[] {
	return parseLines(input).map((line) => parseInt(line));
}

export function parseRegExp(input: string, regExp: RegExp): string[][] {
	return parseLines(input).map((line) => line.match(regExp) as string[]);
}
