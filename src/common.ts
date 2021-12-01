import { readFile } from "fs/promises";

export type ChallengeSpec = {
	day: number;
	part: number;
};

export type ChallengeImpl = (input: string) => any;

export async function challenge(spec: ChallengeSpec, impl: ChallengeImpl) {
	const { day, part } = spec;
	try {
		console.log(`[${day}.${part}] Starting...`);
		const input = await readFile(`./input/day${day}.txt`, "utf-8");
		const result = await impl(input);
		console.log(`[${day}.${part}] Complete:`, result, "\n");
	} catch (error) {
		console.error(`[${day}.${part}] Error:`, error, "\n");
	}
}
