import { challenge, parseLines, parseNumbers } from "./common.js";
const HeightMap = {
    at(heightMap, point) {
        const row = heightMap.data[point.y];
        if (row) {
            return row[point.x];
        }
    },
    forEach(heightMap, fn) {
        for (let x = 0; x < heightMap.width; x += 1) {
            for (let y = 0; y < heightMap.height; y += 1) {
                fn({ x, y }, heightMap.data[y][x]);
            }
        }
    },
};
function parseInput(input) {
    const data = [];
    for (const line of parseLines(input)) {
        data.push(parseNumbers(line, ""));
    }
    return { data, width: data[0].length, height: data.length };
}
function adjacentPoints(point) {
    return [
        { x: point.x + 1, y: point.y },
        { x: point.x - 1, y: point.y },
        { x: point.x, y: point.y + 1 },
        { x: point.x, y: point.y - 1 },
    ];
}
function lowPoints(heightMap) {
    const lowPoints = [];
    HeightMap.forEach(heightMap, (point, height) => {
        if (adjacentPoints(point).every((adjacentPoint) => {
            const adjacentHeight = HeightMap.at(heightMap, adjacentPoint);
            return adjacentHeight === undefined || adjacentHeight > height;
        })) {
            lowPoints.push(point);
        }
    });
    return lowPoints;
}
challenge({ day: 9, part: 1 }, (input) => {
    const heightMap = parseInput(input);
    return lowPoints(heightMap).reduce((riskFactor, point) => {
        return riskFactor + HeightMap.at(heightMap, point) + 1;
    }, 0);
});
challenge({ day: 9, part: 2 }, (input) => {
    const heightMap = parseInput(input);
    const frontiers = lowPoints(heightMap).map((point) => [point]);
    const basinSizes = [];
    for (const frontier of frontiers) {
        let basin = {};
        while (frontier.length) {
            const point = frontier.pop();
            if (basin[JSON.stringify(point)]) {
                continue;
            }
            basin[JSON.stringify(point)] = true;
            frontier.push(...adjacentPoints(point).filter((adjacentPoint) => {
                const adjacentHeight = HeightMap.at(heightMap, adjacentPoint);
                return (adjacentHeight !== undefined &&
                    adjacentHeight !== 9 &&
                    !basin[JSON.stringify(adjacentPoint)]);
            }));
        }
        basinSizes.push(Object.keys(basin).length);
    }
    basinSizes.sort((a, b) => a - b);
    return basinSizes
        .reverse()
        .slice(0, 3)
        .reduce((product, size) => product * size, 1);
});
