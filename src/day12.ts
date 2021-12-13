import { challenge, parseLines } from "./common.js";

type Graph = Record<string, string[]>;
type Path = string[];

function parseInput(input: string): Graph {
	const graph: Graph = {};
	for (const line of parseLines(input)) {
		const [start, end] = line.trim().split("-");
		graph[start] ??= [];
		graph[end] ??= [];
		graph[start].push(end);
		graph[end].push(start);
	}
	return graph;
}

function isBigCave(cave: string): boolean {
	return cave.toUpperCase() === cave;
}

function isSmallCave(cave: string): boolean {
	return cave.toLowerCase() === cave && cave !== "start" && cave !== "end";
}

function paths1(graph: Graph): Path[] {
	const paths: Path[] = [];
	const frontier: Path[] = [["start"]];
	while (frontier.length) {
		const partialPath = frontier.pop() as Path;
		const lastCave = partialPath[partialPath.length - 1];
		const nextCaves = graph[lastCave].filter(
			(cave) => isBigCave(cave) || !partialPath.includes(cave)
		);
		for (const cave of nextCaves) {
			if (cave === "end") {
				paths.push([...partialPath, "end"]);
			} else {
				frontier.push([...partialPath, cave]);
			}
		}
	}
	return paths;
}

function paths2(graph: Graph): Path[] {
	const paths: Path[] = [];
	const frontier: [boolean, Path][] = [[true, ["start"]]];
	while (frontier.length) {
		const [extraVisit, partialPath] = frontier.pop() as [boolean, Path];
		const lastCave = partialPath[partialPath.length - 1];
		const nextCavesExtaVisit = graph[lastCave].filter(
			(cave) => isBigCave(cave) || !partialPath.includes(cave)
		);
		const nextCavesNoExtraVisit = graph[lastCave].filter(
			(cave) => extraVisit && partialPath.includes(cave) && isSmallCave(cave)
		);
		for (const cave of nextCavesExtaVisit) {
			if (cave === "end") {
				paths.push([...partialPath, "end"]);
			} else {
				frontier.push([extraVisit, [...partialPath, cave]]);
			}
		}
		for (const cave of nextCavesNoExtraVisit) {
			frontier.push([false, [...partialPath, cave]]);
		}
	}
	return paths;
}

challenge({ day: 12, part: 1 }, (input) => {
	const graph = parseInput(input);
	return paths1(graph).length;
});

challenge({ day: 12, part: 2 }, (input) => {
	const graph = parseInput(input);
	return paths2(graph).length;
});
