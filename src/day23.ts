import { challenge } from "./common.js";
import { Heap } from "./heap.js";
import { JsonSet } from "./JsonSet.js";

enum AmphipodType {
	Amber = 0,
	Bronze = 1,
	Copper = 2,
	Desert = 3,
}

let MaxRoomRow = 3;

const AmphipodTypeToCharacter = ["A", "B", "C", "D"];

class Point {
	constructor(public x: number, public y: number) {}

	isHallway(): boolean {
		return this.y === 1 && this.x > 0 && this.x < 12;
	}

	isHallwayOutsideRoom(): boolean {
		return (
			this.isHallway() &&
			(this.x === 3 || this.x === 5 || this.x === 7 || this.x === 9)
		);
	}

	isRoom(): boolean {
		return (
			this.y > 1 &&
			this.y <= MaxRoomRow &&
			(this.x === 3 || this.x === 5 || this.x === 7 || this.x === 9)
		);
	}

	adjacentPoints(): Point[] {
		return [
			new Point(this.x + 1, this.y),
			new Point(this.x - 1, this.y),
			new Point(this.x, this.y + 1),
			new Point(this.x, this.y - 1),
		].filter((point) => point.isHallway() || point.isRoom());
	}

	equals(otherPoint: Point): boolean {
		return this.x === otherPoint.x && this.y === otherPoint.y;
	}
}

class Amphipod {
	destinationRoom: number;

	constructor(public type: AmphipodType, public position: Point) {
		this.destinationRoom = 3 + type * 2;
	}

	costToMoveTo(point: Point): number {
		const costPerSpace = 10 ** this.type;
		if (this.position.x === point.x) {
			return Math.abs(this.position.y - point.y) * costPerSpace;
		}
		const moveToHallway = this.position.y - 1;
		const moveToColumn = Math.abs(this.position.x - point.x);
		const moveToRow = Math.abs(1 - point.y);
		return (moveToHallway + moveToColumn + moveToRow) * costPerSpace;
	}

	isInDestination(): boolean {
		return this.isDestination(this.position);
	}

	isDestination(point: Point): boolean {
		return point.isRoom() && point.x === this.destinationRoom;
	}
}

class State {
	constructor(
		public amphipods: Amphipod[],
		public energy: number,
		public previousState?: State
	) {}

	isOrganized(): boolean {
		for (const amphipod of this.amphipods) {
			if (!amphipod.isInDestination()) {
				return false;
			}
		}
		return true;
	}

	nextStates(): State[] {
		const nextStates: State[] = [];
		const visitedIntermediateStates = new JsonSet<IntermediateState>();
		const intermediateStates: IntermediateState[] = [];
		for (const amphipod of this.amphipods) {
			const intermediateState = new IntermediateState(
				this.amphipods,
				amphipod,
				amphipod
			);
			visitedIntermediateStates.add(intermediateState);
			intermediateStates.push(intermediateState);
		}
		while (intermediateStates.length > 0) {
			const intermediateState = intermediateStates.pop() as IntermediateState;
			const amphipod = intermediateState.currentAmphipod;
			const originalAmphipod = intermediateState.originalAmphipod;
			const destinationRoomIncorrectlyOccupied =
				intermediateState.isRoomIncorrectlyOccupied(amphipod.destinationRoom);
			for (const point of amphipod.position.adjacentPoints()) {
				// do not move up in your own room
				if (
					originalAmphipod.isInDestination() &&
					point.y < originalAmphipod.position.y &&
					!destinationRoomIncorrectlyOccupied
				) {
					continue;
				}
				// Cannot move to an occupied point
				if (intermediateState.isOccupied(point)) {
					continue;
				}
				// Cannot move into a wrong room or incorrectly occupied room
				if (
					point.isRoom() &&
					amphipod.position.isHallway() &&
					(!amphipod.isDestination(point) ||
						intermediateState.isRoomIncorrectlyOccupied(point.x))
				) {
					continue;
				}
				// Do not return to a visited state
				const nextIntermediateState = intermediateState.move(point);
				if (visitedIntermediateStates.has(nextIntermediateState)) {
					continue;
				}
				visitedIntermediateStates.add(nextIntermediateState);
				intermediateStates.push(nextIntermediateState);
				// Cannot move from hallway to hallway
				if (originalAmphipod.position.isHallway() && point.isHallway()) {
					continue;
				}
				// Cannot move to space in front of room
				if (point.isHallwayOutsideRoom()) {
					continue;
				}
				// cannot move to the wrong room
				if (point.isRoom() && !amphipod.isDestination(point)) {
					continue;
				}
				// cannot move part way into a room
				if (
					originalAmphipod.position.isHallway() &&
					point.isRoom() &&
					point.x === intermediateState.deepestUnoccupiedRow(point.x)
				) {
					continue;
				}
				nextStates.push(nextIntermediateState.finalize(this));
			}
		}
		return nextStates;
	}

	toString(): string {
		const image = [
			"#############".split(""),
			"#...........#".split(""),
			"###.#.#.#.###".split(""),
			"  #.#.#.#.#".split(""),
			"  #.#.#.#.#".split(""),
			"  #.#.#.#.#".split(""),
			"  #########".split(""),
		];
		for (const amphipod of this.amphipods) {
			image[amphipod.position.y][amphipod.position.x] =
				AmphipodTypeToCharacter[amphipod.type];
		}
		return image.map((row) => row.join("")).join("\n");
	}
}

class IntermediateState {
	constructor(
		public amphipods: Amphipod[],
		public currentAmphipod: Amphipod,
		public originalAmphipod: Amphipod
	) {}

	isOccupied(point: Point): boolean {
		for (const amphipod of this.amphipods) {
			if (amphipod.position.equals(point)) {
				return true;
			}
		}
		return false;
	}

	isRoomIncorrectlyOccupied(room: number): boolean {
		const type = (room - 3) / 2;
		for (const amphipod of this.amphipods) {
			if (amphipod.position.x === room && amphipod.type !== type) {
				return true;
			}
		}
		return false;
	}

	deepestUnoccupiedRow(room: number): number {
		let deepestRow = MaxRoomRow;
		for (const amphipod of this.amphipods) {
			if (amphipod.position.x === room) {
				deepestRow = Math.min(deepestRow, amphipod.position.y);
			}
		}
		return deepestRow;
	}

	move(point: Point): IntermediateState {
		const amphipodIndex = this.amphipods.indexOf(this.currentAmphipod);
		const newAmphipod = new Amphipod(this.currentAmphipod.type, point);
		const newAmphipods = [...this.amphipods];
		newAmphipods[amphipodIndex] = newAmphipod;
		return new IntermediateState(
			newAmphipods,
			newAmphipod,
			this.originalAmphipod
		);
	}

	finalize(originalState: State): State {
		const cost = this.originalAmphipod.costToMoveTo(
			this.currentAmphipod.position
		);
		return new State(
			this.amphipods,
			originalState.energy + cost
			// originalState // for tracing
		);
	}
}

function parseInput(input: string): State {
	const amphipods: Amphipod[] = [];
	const lines = input.split("\n");
	for (let y = 0; y < lines.length; y += 1) {
		const line = lines[y];
		for (let x = 0; x < line.length; x += 1) {
			const type = AmphipodTypeToCharacter.indexOf(line[x]);
			if (type !== -1) {
				amphipods.push(new Amphipod(type, new Point(x, y)));
			}
		}
	}
	return new State(amphipods, 0);
}

function energyDifference(state1: State, state2: State): number {
	return state2.energy - state1.energy;
}

function energyToOrganize(initialState: State): number {
	const heap = new Heap(energyDifference);
	const visited = new JsonSet<Amphipod[]>();
	heap.push(initialState);
	for (;;) {
		const state = heap.pop();
		if (state === undefined) {
			throw new Error("Ran out of possibilities!");
		}
		if (visited.has(state.amphipods)) {
			continue;
		}
		visited.add(state.amphipods);
		// prettier-ignore
		const desired = `#############
#.........A.#
###.#B#C#D###
  #A#B#C#D#
  #########`;
		// if (state.toString() === desired) {
		// throw new Error("Found desried state: " + state.energy);
		// }
		if (state.isOrganized()) {
			// const trace: State[] = [];
			// let currentState: State | undefined = state;
			// while (currentState) {
			// 	trace.unshift(currentState);
			// 	currentState = currentState.previousState;
			// }
			// let totalEnergy = 0;
			// for (const traceState of trace) {
			// 	console.log(traceState.toString());
			// 	console.log(
			// 		`${traceState.energy} (${traceState.energy - totalEnergy})`
			// 	);
			// 	console.log();
			// 	totalEnergy += traceState.energy;
			// }
			return state.energy;
		}
		const nextStates = state.nextStates();
		for (const nextState of nextStates) {
			if (!visited.has(nextState.amphipods)) {
				heap.push(nextState);
			}
		}
		console.log(
			`heap size = ${heap.size} | energy = ${state.energy} | new states = ${nextStates.length}`
		);
	}
}

challenge({ day: 23, part: 1 }, (input) => {
	MaxRoomRow = 3;
	const initialState = parseInput(input);
	return energyToOrganize(initialState);
});

challenge({ day: 23, part: 2 }, (input) => {
	MaxRoomRow = 5;
	const initialState = parseInput(input);
	return energyToOrganize(initialState);
});
