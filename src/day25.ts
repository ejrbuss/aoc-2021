import { challenge, parseLines } from "./common.js";

enum Tile {
	Empty = 0,
	East = 1,
	South = 2,
}

type Point = {
	x: number;
	y: number;
};

type State = {
	tiles: Tile[];
	width: number;
	height: number;
};

const CharToTile: Record<string, Tile> = {
	["."]: Tile.Empty,
	[">"]: Tile.East,
	["v"]: Tile.South,
};

const TileToChar: Record<Tile, string> = {
	[Tile.Empty]: ".",
	[Tile.East]: ">",
	[Tile.South]: "v",
};

function* iterTiles(state: State): Generator<[Point, Tile]> {
	for (let y = 0; y < state.height; y += 1) {
		for (let x = 0; x < state.width; x += 1) {
			const point = { x, y };
			const tile = tileAt(state, point);
			yield [point, tile];
		}
	}
}

function printTiles(state: State) {
	const lines: string[] = [];
	for (let y = 0; y < state.height; y += 1) {
		const line: string[] = [];
		for (let x = 0; x < state.width; x += 1) {
			const point = { x, y };
			const tile = tileAt(state, point);
			line.push(TileToChar[tile]);
		}
		lines.push(line.join(""));
	}
	return lines.join("\n");
}

function tileAt(state: State, point: Point): Tile {
	const x = point.x % state.width;
	const y = point.y % state.height;
	return state.tiles[state.width * y + x];
}

function moveTile(state: State, from: Point, to: Point) {
	const fromX = from.x % state.width;
	const fromY = from.y % state.height;
	const toX = to.x % state.width;
	const toY = to.y % state.height;
	const tile = state.tiles[state.width * fromY + fromX];
	state.tiles[state.width * fromY + fromX] = Tile.Empty;
	state.tiles[state.width * toY + toX] = tile;
}

function eastOf(point: Point): Point {
	return { x: point.x + 1, y: point.y };
}

function southOf(point: Point): Point {
	return { x: point.x, y: point.y + 1 };
}

function parseInput(input: string): State {
	const lines = parseLines(input);
	const tiles: Tile[] = [];
	for (const line of lines) {
		for (const char of line.split("")) {
			tiles.push(CharToTile[char]);
		}
	}
	const height = lines.length;
	const width = tiles.length / height;
	return { tiles, width, height };
}

function stepCucumbers(state: State): boolean {
	let changed = false;
	const toMoveEast: Point[] = [];
	for (const [point, tile] of iterTiles(state)) {
		if (tile === Tile.East && tileAt(state, eastOf(point)) === Tile.Empty) {
			toMoveEast.push(point);
		}
	}
	for (const from of toMoveEast) {
		changed = true;
		moveTile(state, from, eastOf(from));
	}
	const toMoveSouth: Point[] = [];
	for (const [point, tile] of iterTiles(state)) {
		if (tile === Tile.South && tileAt(state, southOf(point)) === Tile.Empty) {
			toMoveSouth.push(point);
		}
	}
	for (const from of toMoveSouth) {
		changed = true;
		moveTile(state, from, southOf(from));
	}
	return changed;
}

challenge({ day: 25, part: 1 }, (input) => {
	const state = parseInput(input);
	let steps = 0;
	do {
		steps += 1;
	} while (stepCucumbers(state));
	return steps;
});
