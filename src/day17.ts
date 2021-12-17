import { challenge } from "./common.js";

type Ranges = {
	xMin: number;
	xMax: number;
	yMin: number;
	yMax: number;
};

function inRange(x: number, y: number, ranges: Ranges): boolean {
	const { xMin, xMax, yMin, yMax } = ranges;
	return xMin <= x && x <= xMax && yMin <= y && y <= yMax;
}

function parseInput(input: string): Ranges {
	const match = input.match(
		/target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/
	) as string[];
	const [xMin, xMax, yMin, yMax] = match.slice(1).map((n) => parseInt(n));
	return { xMin, xMax, yMin, yMax };
}

function findMaxHeight(
	targetArea: Ranges,
	xVel: number,
	yVel: number
): number | undefined {
	let x = 0;
	let y = 0;
	let maxHeight = 0;
	for (;;) {
		x += xVel;
		y += yVel;
		maxHeight = Math.max(maxHeight, y);
		xVel = Math.max(0, xVel - 1);
		yVel -= 1;
		if (inRange(x, y, targetArea)) {
			return maxHeight;
		}
		if (x > targetArea.xMax || y < targetArea.yMin) {
			return;
		}
	}
}

challenge({ day: 17, part: 1 }, (input) => {
	const targetArea = parseInput(input);
	let maxHeight = 0;
	for (let yVel = -1000; yVel < 1000; yVel += 1) {
		for (let xVel = 1; xVel < 1000; xVel += 1) {
			console.log(xVel, yVel);
			const height = findMaxHeight(targetArea, xVel, yVel);
			if (height) {
				maxHeight = height;
			}
		}
	}
	return maxHeight;
});

challenge({ day: 17, part: 2 }, (input) => {
	const targetArea = parseInput(input);
	let trajectories = 0;
	for (let yVel = -1000; yVel < 1000; yVel += 1) {
		for (let xVel = 1; xVel < 1000; xVel += 1) {
			const height = findMaxHeight(targetArea, xVel, yVel);
			if (height !== undefined) {
				trajectories += 1;
			}
		}
	}
	return trajectories;
});
