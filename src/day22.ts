import { challenge, parseLines } from "./common.js";

type Point = {
	x: number;
	y: number;
	z: number;
};

type Cuboid = {
	begin: Point;
	end: Point;
};

function cuboidVolume(cuboid: Cuboid): number {
	const xDiff = cuboid.end.x - cuboid.begin.x + 1;
	const yDiff = cuboid.end.y - cuboid.begin.y + 1;
	const zDiff = cuboid.end.z - cuboid.begin.z + 1;
	return xDiff * yDiff * zDiff;
}

type Region = {
	cuboid: Cuboid;
	on: boolean;
};

function cuboidIntersection(
	cuboid1: Cuboid,
	cuboid2: Cuboid
): Cuboid | undefined {
	const intersection = {
		begin: {
			x: Math.max(cuboid1.begin.x, cuboid2.begin.x),
			y: Math.max(cuboid1.begin.y, cuboid2.begin.y),
			z: Math.max(cuboid1.begin.z, cuboid2.begin.z),
		},
		end: {
			x: Math.min(cuboid1.end.x, cuboid2.end.x),
			y: Math.min(cuboid1.end.y, cuboid2.end.y),
			z: Math.min(cuboid1.end.z, cuboid2.end.z),
		},
	};
	if (
		intersection.begin.x <= intersection.end.x &&
		intersection.begin.y <= intersection.end.y &&
		intersection.begin.z <= intersection.end.z
	) {
		return intersection;
	}
}

function parseInput(input: string): Region[] {
	const regions: Region[] = [];
	for (const line of parseLines(input)) {
		const [_, onOff, x1, x2, y1, y2, z1, z2] = line.match(
			/(\w+) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/
		) as string[];
		regions.push({
			cuboid: {
				begin: {
					x: parseInt(x1),
					y: parseInt(y1),
					z: parseInt(z1),
				},
				end: {
					x: parseInt(x2),
					y: parseInt(y2),
					z: parseInt(z2),
				},
			},
			on: onOff === "on",
		});
	}
	return regions;
}

function rebootVolume(rebootRegions: Region[]): number {
	const finalRegions: Region[] = [];
	for (const region of rebootRegions) {
		const newRegions: Region[] = [];
		for (const otherRegion of finalRegions) {
			const intersection = cuboidIntersection(
				region.cuboid,
				otherRegion.cuboid
			);
			if (intersection) {
				newRegions.push({
					cuboid: intersection,
					on: !otherRegion.on,
				});
			}
		}
		if (region.on) {
			newRegions.push(region);
		}
		finalRegions.push(...newRegions);
	}
	let totalVolume = 0;
	for (const region of finalRegions) {
		const volume = cuboidVolume(region.cuboid);
		totalVolume += region.on ? volume : -volume;
	}
	return totalVolume;
}

challenge({ day: 22, part: 1 }, (input) => {
	const rebootSteps = parseInput(input).filter(
		(region) =>
			Math.abs(region.cuboid.begin.x) <= 50 &&
			Math.abs(region.cuboid.begin.x) <= 50 &&
			Math.abs(region.cuboid.begin.y) <= 50 &&
			Math.abs(region.cuboid.end.y) <= 50 &&
			Math.abs(region.cuboid.end.z) <= 50 &&
			Math.abs(region.cuboid.end.z) <= 50
	);
	return rebootVolume(rebootSteps);
});

challenge({ day: 22, part: 2 }, (input) => {
	const rebootSteps = parseInput(input);
	return rebootVolume(rebootSteps);
});
