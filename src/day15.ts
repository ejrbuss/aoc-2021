import { equal } from "assert";
import { challenge, parseLines, parseNumbers } from "./common.js";

// Data Structures

type Point = {
	x: number;
	y: number;
};

function adjacentPoints(point: Point): Point[] {
	const { x, y } = point;
	return [
		{ x: x + 1, y },
		{ x: x - 1, y },
		{ x, y: y + 1 },
		{ x, y: y - 1 },
	];
}

function equalPoints(point1: Point, point2: Point): boolean {
	return point1.x === point2.x && point1.y === point2.y;
}

type Grid<T> = {
	data: T[];
	width: number;
	height: number;
};

function gridOf<T>(value: T, width: number, height: number): Grid<T> {
	return {
		data: new Array(width * height).fill(value),
		width,
		height,
	};
}

function getGridAt<T>(grid: Grid<T>, point: Point): T | undefined {
	const { data, width, height } = grid;
	const { x, y } = point;
	if (0 > x || x >= width) {
		return;
	}
	if (0 > y || y >= height) {
		return;
	}
	return data[width * y + x];
}

function setGridAt<T>(grid: Grid<T>, point: Point, risk: T) {
	const { data, width } = grid;
	const { x, y } = point;
	data[width * y + x] = risk;
}

function getGridPoints(grid: Grid<unknown>): Point[] {
	const { width, height } = grid;
	const points: Point[] = [];
	for (let y = 0; y < height; y += 1) {
		for (let x = 0; x < width; x += 1) {
			points.push({ x, y });
		}
	}
	return points;
}

function tile5x5(grid: Grid<number>): Grid<number> {
	const { width, height } = grid;
	const tiledWidth = width * 5;
	const tiledHeight = height * 5;
	const tiledGrid = {
		data: new Array(tiledWidth * tiledHeight),
		width: tiledWidth,
		height: tiledHeight,
	};
	for (let y = 0; y < tiledHeight; y += 1) {
		for (let x = 0; x < tiledWidth; x += 1) {
			const baseValue = getGridAt(grid, {
				y: y % height,
				x: x % width,
			}) as number;
			const additiveValue = Math.floor(y / height) + Math.floor(x / width);
			setGridAt(tiledGrid, { x, y }, 1 + ((baseValue - 1 + additiveValue) % 9));
		}
	}
	return tiledGrid;
}

function printGrid(grid: Grid<unknown>, sep: string): string {
	const { width, height } = grid;
	const lines: string[] = [];
	for (let y = 0; y < height; y += 1) {
		const line: string[] = [];
		for (let x = 0; x < width; x += 1) {
			line.push(`${getGridAt(grid, { x, y })}`);
		}
		lines.push(line.join(sep));
	}
	return lines.join("\n");
}

// Implementation

function parseInput(input: string): Grid<number> {
	const data: number[] = [];
	const lines = parseLines(input);
	for (const line of lines) {
		for (const risk of parseNumbers(line, "")) {
			data.push(risk);
		}
	}
	return {
		data,
		width: lines[0].length,
		height: lines.length,
	};
}

function lowestRiskPath(grid: Grid<number>, start: Point, end: Point): number {
	const { width, height } = grid;
	const riskGrid = gridOf(Infinity, width, height);
	const visitedPoints: Record<string, boolean> = {};
	const unvisitedPoints: Record<string, boolean> = {};

	setGridAt(riskGrid, start, 0);
	unvisitedPoints[JSON.stringify(start)] = true;

	for (;;) {
		// Find the lowest tentative risk point
		let currentJsonPoint!: string;
		let currentPoint!: Point;
		let currentRisk = Infinity;
		for (const jsonPoint in unvisitedPoints) {
			const point = JSON.parse(jsonPoint) as Point;
			const risk = getGridAt(riskGrid, point);
			if (risk !== undefined && risk < currentRisk) {
				currentJsonPoint = jsonPoint;
				currentPoint = point;
				currentRisk = risk;
			}
		}

		// Check if this the end
		if (equalPoints(currentPoint, end)) {
			return currentRisk;
		}

		// Determine risks of neighbors
		for (const neighborPoint of adjacentPoints(currentPoint)) {
			const neighborJsonPoint = JSON.stringify(neighborPoint);
			if (visitedPoints[neighborJsonPoint]) {
				continue;
			}
			const neighborRisk = getGridAt(grid, neighborPoint);
			if (neighborRisk === undefined) {
				continue;
			}
			if (
				currentRisk + neighborRisk <
				(getGridAt(riskGrid, neighborPoint) as number)
			) {
				unvisitedPoints[neighborJsonPoint] = true;
				setGridAt(riskGrid, neighborPoint, currentRisk + neighborRisk);
			}
		}

		// Mark as visited
		delete unvisitedPoints[currentJsonPoint];
		visitedPoints[currentJsonPoint] = true;
	}
}

challenge({ day: 15, part: 1 }, (input) => {
	const grid = parseInput(input);
	return lowestRiskPath(
		grid,
		{ x: 0, y: 0 },
		{ x: grid.width - 1, y: grid.height - 1 }
	);
});

challenge({ day: 15, part: 2 }, (input) => {
	const grid = tile5x5(parseInput(input));
	return lowestRiskPath(
		grid,
		{ x: 0, y: 0 },
		{ x: grid.width - 1, y: grid.height - 1 }
	);
});
