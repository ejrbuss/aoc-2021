import { challenge, parseNumbers } from "./common.js";

type Populations = Map<number, bigint>;

function parseInput(input: string): Populations {
	const populations: Populations = new Map();
	for (const daysRemaining of parseNumbers(input, ",")) {
		increment(populations, daysRemaining);
	}
	return populations;
}

function increment(
	populations: Populations,
	daysRemaining: number,
	increment: bigint = 1n
) {
	populations.set(
		daysRemaining,
		(populations.get(daysRemaining) ?? 0n) + increment
	);
}

function nextGeneration(generation: Populations): Populations {
	const nextGeneration: Populations = new Map();
	for (const [daysRemaining, population] of generation.entries()) {
		if (daysRemaining) {
			increment(nextGeneration, daysRemaining - 1, population);
		} else {
			increment(nextGeneration, 6, population);
			increment(nextGeneration, 8, population);
		}
	}
	return nextGeneration;
}

function nGenerations(
	initialPopulations: Populations,
	generation: number
): Populations {
	let populations = initialPopulations;
	for (let i = 0; i < generation; i += 1) {
		populations = nextGeneration(populations);
	}
	return populations;
}

function totalPopulation(populations: Populations): bigint {
	let totalPopulation = 0n;
	for (const population of populations.values()) {
		totalPopulation += population;
	}
	return totalPopulation;
}

challenge({ day: 6, part: 1 }, (input) => {
	return totalPopulation(nGenerations(parseInput(input), 80));
});

challenge({ day: 6, part: 2 }, (input) => {
	return totalPopulation(nGenerations(parseInput(input), 256));
});
