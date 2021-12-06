import { challenge, parseNumbers } from "./common.js";
function parseInput(input) {
    const populations = new Map();
    for (const daysRemaining of parseNumbers(input, ",")) {
        increment(populations, daysRemaining);
    }
    return populations;
}
function increment(populations, daysRemaining, increment = 1n) {
    populations.set(daysRemaining, (populations.get(daysRemaining) ?? 0n) + increment);
}
function nextGeneration(generation) {
    const nextGeneration = new Map();
    for (const [daysRemaining, population] of generation.entries()) {
        if (daysRemaining) {
            increment(nextGeneration, daysRemaining - 1, population);
        }
        else {
            increment(nextGeneration, 6, population);
            increment(nextGeneration, 8, population);
        }
    }
    return nextGeneration;
}
function nGenerations(initialPopulations, generation) {
    let populations = initialPopulations;
    for (let i = 0; i < generation; i += 1) {
        populations = nextGeneration(populations);
    }
    return populations;
}
function totalPopulation(populations) {
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
