import { challenge, max, min, parseNumbers } from "./common.js";
function parseInput(input) {
    return parseNumbers(input, ",");
}
challenge({ day: 7, part: 1 }, (input) => {
    const crabPositions = parseInput(input);
    const minPosition = min(crabPositions);
    const maxPosition = max(crabPositions);
    const fuelCosts = [];
    for (let position = minPosition; position <= maxPosition; position += 1) {
        let fuelCost = 0;
        for (const crabPosition of crabPositions) {
            const distance = Math.abs(crabPosition - position);
            fuelCost += distance;
        }
        fuelCosts.push(fuelCost);
    }
    return min(fuelCosts);
});
challenge({ day: 7, part: 2 }, (input) => {
    const crabPositions = parseInput(input);
    const minPosition = min(crabPositions);
    const maxPosition = max(crabPositions);
    const fuelCosts = [];
    for (let position = minPosition; position <= maxPosition; position += 1) {
        let fuelCost = 0;
        for (const crabPosition of crabPositions) {
            const distance = Math.abs(crabPosition - position);
            fuelCost += (distance * (distance + 1)) / 2;
        }
        fuelCosts.push(fuelCost);
    }
    return min(fuelCosts);
});
