import { challenge, parseRegExp } from "./common.js";

type Point = {
	x: number;
	y: number;
};

type Line = {
	begin: Point;
	end: Point;
};

function parseInput(input: string): Line[] {
	return parseRegExp(input, /(\d+),(\d+) -> (\d+),(\d+)/).map(
		([_, x1, y1, x2, y2]) => ({
			begin: { x: parseInt(x1), y: parseInt(y1) },
			end: { x: parseInt(x2), y: parseInt(y2) },
		})
	);
}

function isHorizontal(line: Line): boolean {
	return line.begin.y === line.end.y;
}

function isVertical(line: Line): boolean {
	return line.begin.x === line.end.x;
}

function add(p1: Point, p2: Point): Point {
	return { x: p1.x + p2.x, y: p1.y + p2.y };
}

function equal(p1: Point, p2: Point): boolean {
	return p1.x === p2.x && p1.y === p2.y;
}

function countOverlaps(lines: Line[]): number {
	let overlaps = 0;
	const counts: Record<string, number> = {};
	for (const line of lines) {
		for (const point of pointsAlong(line)) {
			const key = JSON.stringify(point);
			if (counts[key] === 1) {
				overlaps += 1;
			}
			counts[key] = (counts[key] ?? 0) + 1;
		}
	}
	return overlaps;
}

function pointsAlong(line: Line): Point[] {
	let step = {
		x: line.begin.x === line.end.x ? 0 : line.begin.x < line.end.x ? 1 : -1,
		y: line.begin.y === line.end.y ? 0 : line.begin.y < line.end.y ? 1 : -1,
	};
	let current = line.begin;
	const points = [current];
	while (!equal(current, line.end)) {
		current = add(current, step);
		points.push(current);
	}
	return points;
}

challenge({ day: 5, part: 1 }, (input) => {
	return countOverlaps(
		parseInput(input).filter((line) => isHorizontal(line) || isVertical(line))
	);
});

challenge({ day: 5, part: 2 }, (input) => {
	return countOverlaps(parseInput(input));
});
