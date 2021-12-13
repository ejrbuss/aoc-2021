import { challenge, parseLines } from "./common.js";
function parseInput(input) {
    const rows = [];
    for (const line of parseLines(input)) {
        const row = [];
        for (const char of line.trim().split("")) {
            row.push(parseInt(char));
        }
        rows.push(row);
    }
    return rows;
}
function step(octopusEnergy) {
    // The energy level of each octopus increases by 1
    for (let x = 0; x < 10; x += 1) {
        for (let y = 0; y < 10; y += 1) {
            octopusEnergy[y][x] += 1;
        }
    }
    // Then, any octopus with an energy level greater than 9 flashes. This
    // increases the energy level of all adjacent octopuses by 1, including
    // octopuses that are diagonally adjacent. If this causes an octopus to
    // have an energy level greater than 9, it also flashes. This process
    // continues as long as new octopuses keep having their energy level
    // increased beyond 9. (An octopus can only flash at most once per step).
    const flashed = {};
    const frontier = [];
    // Gather initial frontier
    for (let x = 0; x < 10; x += 1) {
        for (let y = 0; y < 10; y += 1) {
            if (octopusEnergy[y][x] > 9) {
                frontier.push({ x, y });
            }
        }
    }
    // Traverse frontier
    while (frontier.length) {
        const point = frontier.pop();
        const key = JSON.stringify(point);
        if (key in flashed) {
            continue;
        }
        flashed[key] = true;
        octopusEnergy[point.y][point.x] = 0;
        for (const adjacentPoint of adjacentPoints(point)) {
            const adjacentKey = JSON.stringify(adjacentPoint);
            if (adjacentKey in flashed) {
                continue;
            }
            octopusEnergy[adjacentPoint.y][adjacentPoint.x] += 1;
            if (octopusEnergy[adjacentPoint.y][adjacentPoint.x] > 9) {
                frontier.push(adjacentPoint);
            }
        }
    }
    return Object.keys(flashed).length;
}
function adjacentPoints(point) {
    return [
        { x: point.x + 1, y: point.y },
        { x: point.x - 1, y: point.y },
        { x: point.x, y: point.y + 1 },
        { x: point.x, y: point.y - 1 },
        { x: point.x + 1, y: point.y + 1 },
        { x: point.x - 1, y: point.y - 1 },
        { x: point.x + 1, y: point.y - 1 },
        { x: point.x - 1, y: point.y + 1 },
    ].filter(inBounds);
}
function inBounds(point) {
    return 0 <= point.x && point.x < 10 && 0 <= point.y && point.y < 10;
}
challenge({ day: 11, part: 1 }, (input) => {
    const octopusEnergy = parseInput(input);
    let flashes = 0;
    for (let i = 0; i < 100; i += 1) {
        flashes += step(octopusEnergy);
    }
    return flashes;
});
challenge({ day: 11, part: 2 }, (input) => {
    const octopusEnergy = parseInput(input);
    for (let i = 0;; i += 1) {
        if (step(octopusEnergy) === 100) {
            return i + 1;
        }
    }
});
