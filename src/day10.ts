import { challenge, parseLines } from "./common.js";

const IllegalCharacterScores: Record<string, number> = {
	")": 3,
	"]": 57,
	"}": 1197,
	">": 25137,
};

const CompletionCharacterScores: Record<string, number> = {
	")": 1,
	"]": 2,
	"}": 3,
	">": 4,
};

const OpenChunk = "([{<";
const CloseChunk = ")]}>";

function scoreLine(line: string): number {
	const chunks: string[] = [];
	for (let i = 0; i < line.length; i += 1) {
		const char = line.charAt(i);
		const index = OpenChunk.indexOf(char);
		if (index !== -1) {
			chunks.push(CloseChunk[index]);
			continue;
		}
		if (chunks.pop() !== char) {
			return IllegalCharacterScores[char];
		}
	}
	return 0;
}

function scoreCompletion(line: string): number {
	const chunks: string[] = [];
	for (let i = 0; i < line.length; i += 1) {
		const char = line.charAt(i);
		const index = OpenChunk.indexOf(char);
		if (index !== -1) {
			chunks.push(CloseChunk[index]);
			continue;
		} else {
			chunks.pop();
		}
	}
	const completion = chunks.reverse().join("");
	let score = 0;
	for (let i = 0; i < completion.length; i += 1) {
		score *= 5;
		score += CompletionCharacterScores[completion.charAt(i)];
	}
	return score;
}

challenge({ day: 10, part: 1 }, (input) => {
	const lines = parseLines(input);
	const scores = lines.map(scoreLine);
	return scores.reduce((a, b) => a + b);
});

challenge({ day: 10, part: 2 }, (input) => {
	const lines = parseLines(input);
	const incompleteLines = lines.filter((line) => scoreLine(line) === 0);
	const scores = incompleteLines.map(scoreCompletion);
	scores.sort((a, b) => a - b);
	return scores[Math.floor(scores.length / 2)];
});
