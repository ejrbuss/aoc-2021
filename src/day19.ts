import { challenge, parseLines } from "./common.js";
import { JsonMap } from "./jsonMap.js";

class Orientation {
	constructor(
		public shift: number,
		public xsign: number,
		public ysign: number,
		public zsign: number
	) {}
}

// Gather all orientations
const Orientations: Orientation[] = [];
const signs = [+1, -1];
const shifts = [-3, -2, -1, 0, 1, 2];
for (const shift of shifts) {
	for (const xsign of signs) {
		for (const ysign of signs) {
			for (const zsign of signs) {
				Orientations.push(new Orientation(shift, xsign, ysign, zsign));
			}
		}
	}
}

class Vector {
	constructor(public x: number, public y: number, public z: number) {}
}

function addVectors(vector1: Vector, vector2: Vector): Vector {
	return new Vector(
		vector1.x + vector2.x,
		vector1.y + vector2.y,
		vector1.z + vector2.z
	);
}

function subVectors(vector1: Vector, vector2: Vector): Vector {
	return new Vector(
		vector1.x - vector2.x,
		vector1.y - vector2.y,
		vector1.z - vector2.z
	);
}

function manhattanDistance(vector1: Vector, vector2: Vector): number {
	return (
		Math.abs(vector1.x - vector2.x) +
		Math.abs(vector1.y - vector2.y) +
		Math.abs(vector1.z - vector2.z)
	);
}

function vectorWithOrientation(
	vector: Vector,
	orientation: Orientation
): Vector {
	switch (orientation.shift) {
		case -3:
			return new Vector(
				vector.y * orientation.zsign,
				vector.x * orientation.ysign,
				vector.z * orientation.xsign
			);
		case -2:
			return new Vector(
				vector.x * orientation.zsign,
				vector.z * orientation.ysign,
				vector.y * orientation.xsign
			);
		case -1:
			return new Vector(
				vector.z * orientation.zsign,
				vector.y * orientation.ysign,
				vector.x * orientation.xsign
			);
		case 0:
			return new Vector(
				vector.x * orientation.xsign,
				vector.y * orientation.ysign,
				vector.z * orientation.zsign
			);
		case 1:
			return new Vector(
				vector.y * orientation.xsign,
				vector.z * orientation.ysign,
				vector.x * orientation.zsign
			);
		case 2:
			return new Vector(
				vector.z * orientation.xsign,
				vector.x * orientation.ysign,
				vector.y * orientation.zsign
			);
		default:
			throw new Error("Malformed Orientation: " + JSON.stringify(orientation));
	}
}

function vectorsWithOrientation(
	vectors: Vector[],
	orientation: Orientation
): Vector[] {
	return vectors.map((vector) => vectorWithOrientation(vector, orientation));
}

class Alignmnet {
	constructor(public orientation: Orientation, public translation: Vector) {}
}

function vectorWithAlignment(vector: Vector, alignment: Alignmnet): Vector {
	return addVectors(
		vectorWithOrientation(vector, alignment.orientation),
		alignment.translation
	);
}

function vectorsWithAlignment(
	vectors: Vector[],
	alignment: Alignmnet
): Vector[] {
	return vectors.map((vector) => vectorWithAlignment(vector, alignment));
}

class Beacon {
	neighbors: JsonMap<Vector, Beacon> = new JsonMap();
}

function addBeaconPositions(
	beacons: JsonMap<Vector, Beacon>,
	beaconPositions: Vector[]
) {
	for (const position of beaconPositions) {
		if (beacons.has(position)) {
			continue;
		}
		const beacon = new Beacon();
		for (const [otherPosition, otherBeacon] of beacons.entries()) {
			beacon.neighbors.set(subVectors(otherPosition, position), otherBeacon);
			otherBeacon.neighbors.set(subVectors(position, otherPosition), beacon);
		}
		beacons.set(position, beacon);
	}
}

class Position {
	neighbors: JsonMap<Vector, boolean> = new JsonMap();
	constructor(public position: Vector, neighbors: Vector[]) {
		for (const otherPosition of neighbors) {
			if (position === otherPosition) {
				continue;
			}
			this.neighbors.set(subVectors(otherPosition, position), true);
		}
	}
}

class Scanner {
	orientedPositions: JsonMap<Orientation, Position[]> = new JsonMap();
	position: Vector = new Vector(0, 0, 0);
	constructor(public scannerNumber: number, public beaconPositions: Vector[]) {}

	initCache() {
		for (const orientation of Orientations) {
			const positions = vectorsWithOrientation(
				this.beaconPositions,
				orientation
			);
			const orientedPositions: Position[] = [];
			for (const position of positions) {
				orientedPositions.push(new Position(position, positions));
			}
			this.orientedPositions.set(orientation, orientedPositions);
		}
	}
}

function parseInput(input: string): Scanner[] {
	let scannerInputs: Scanner[] = [];
	let beaconPositions: Vector[] = [];
	for (const line of parseLines(input)) {
		const scannerMatch = line.match(/--- scanner (\d+) ---/);
		if (scannerMatch) {
			const scannerNumber = parseInt(scannerMatch[1]);
			beaconPositions = [];
			scannerInputs.push(new Scanner(scannerNumber, beaconPositions));
			continue;
		}
		const positionMatch = line.match(/(-?\d+),(-?\d+),(-?\d+)/);
		if (positionMatch) {
			const [_, x, y, z] = positionMatch;
			beaconPositions.push(new Vector(parseInt(x), parseInt(y), parseInt(z)));
		}
	}
	scannerInputs.forEach((scanner) => scanner.initCache());
	return scannerInputs;
}

function findScannerAlignment(
	beacons: JsonMap<Vector, Beacon>,
	scanner: Scanner
): Alignmnet | undefined {
	for (const [
		orientation,
		orientedPositions,
	] of scanner.orientedPositions.entries()) {
		for (const position of orientedPositions) {
			for (const [beaconPosition, beacon] of beacons.entries()) {
				if (hasEnoughSharedNeighbors(position.neighbors, beacon.neighbors)) {
					const translation = subVectors(beaconPosition, position.position);
					return new Alignmnet(orientation, translation);
				}
			}
		}
	}
}

function hasEnoughSharedNeighbors(
	neighbors1: JsonMap<Vector, unknown>,
	neighbors2: JsonMap<Vector, unknown>
): boolean {
	let count = 1;
	for (const position of neighbors1.keys()) {
		if (neighbors2.has(position)) {
			count += 1;
			if (count >= 12) {
				return true;
			}
		}
	}
	return false;
}

function findAllBeacons(scanners: Scanner[]): JsonMap<Vector, Beacon> {
	scanners = [...scanners];
	const scanner0 = scanners.shift() as Scanner;
	const beacons: JsonMap<Vector, Beacon> = new JsonMap();
	addBeaconPositions(beacons, scanner0.beaconPositions);
	while (scanners.length) {
		const scanner = scanners.shift() as Scanner;
		console.log("Trying scanner:", scanner.scannerNumber);
		console.log("Beacons so far:", beacons.size);
		const alignment = findScannerAlignment(beacons, scanner);
		if (alignment) {
			console.log("Found alignment!");
			addBeaconPositions(
				beacons,
				vectorsWithAlignment(scanner.beaconPositions, alignment)
			);
			scanner.position = alignment.translation;
		} else {
			scanners.push(scanner);
		}
	}
	return beacons;
}

challenge({ day: 19, part: 1 }, (input) => {
	const scanners = parseInput(input);
	const beacons = findAllBeacons(scanners);
	return beacons.size;
});

challenge({ day: 19, part: 2 }, (input) => {
	const scanners = parseInput(input);
	findAllBeacons(scanners);
	let maxDistance = 0;
	for (const scanner1 of scanners) {
		for (const scanner2 of scanners) {
			maxDistance = Math.max(
				maxDistance,
				manhattanDistance(scanner1.position, scanner2.position)
			);
		}
	}
	return maxDistance;
});
