import { challenge, parseLines, parseNumbers } from "./common.js";

type Point = {
	x: number;
	y: number;
};

type Grid = Record<string, boolean>;

const Grid = {
	set(grid: Grid, point: Point) {
		grid[JSON.stringify(point)] = true;
	},

	get(grid: Grid, point: Point): boolean {
		return grid[JSON.stringify(point)];
	},

	dotCount(grid: Grid): number {
		let count = 0;
		for (const key in grid) {
			if (grid[key]) {
				count += 1;
			}
		}
		return count;
	},

	dimensions(grid: Grid): { width: number; height: number } {
		let width = 0;
		let height = 0;
		for (const key in grid) {
			const point = JSON.parse(key) as Point;
			width = Math.max(width, point.x + 1);
			height = Math.max(height, point.y + 1);
		}
		return { width, height };
	},

	*entries(grid: Grid): Generator<[Point, Boolean]> {
		for (const key in grid) {
			yield [JSON.parse(key) as Point, grid[key]];
		}
	},

	toString(grid: Grid): string {
		const { width, height } = Grid.dimensions(grid);
		let result = "";
		for (let y = 0; y < height; y += 1) {
			for (let x = 0; x < width; x += 1) {
				result += Grid.get(grid, { x, y }) ? "#" : ".";
			}
			result += "\n";
		}
		return result;
	},
};

function parseInput(input: string): { grid: Grid; folds: Point[] } {
	const grid: Grid = {};
	const folds: Point[] = [];
	let parsingPoints = true;
	for (const line of parseLines(input)) {
		if (line.trim().length === 0) {
			parsingPoints = false;
		} else if (parsingPoints) {
			const [x, y] = parseNumbers(line, ",");
			Grid.set(grid, { x, y });
		} else {
			const [_, x, y] = line.match(
				/fold along (?:x=(\d+))?(?:y=(\d+))?/
			) as string[];
			folds.push({ x: parseInt(x ?? "0"), y: parseInt(y ?? "0") });
		}
	}
	return { grid, folds };
}

function foldGrid(grid: Grid, fold: Point): Grid {
	const foldedGrid: Grid = {};
	for (const [point] of Grid.entries(grid)) {
		Grid.set(foldedGrid, foldPoint(point, fold));
	}
	return foldedGrid;
}

function foldPoint(point: Point, fold: Point): Point {
	let { x, y } = point;
	if (fold.x && x >= fold.x) {
		x = fold.x - (x - fold.x);
	}
	if (fold.y && y >= fold.y) {
		y = fold.y - (y - fold.y);
	}
	return { x, y };
}

challenge({ day: 13, part: 1 }, (input) => {
	let { grid, folds } = parseInput(input);
	grid = foldGrid(grid, folds[0]);
	return Grid.dotCount(grid);
});

challenge({ day: 13, part: 2 }, (input) => {
	let { grid, folds } = parseInput(input);
	for (const fold of folds) {
		grid = foldGrid(grid, fold);
	}
	return Grid.toString(grid);
});
