import { challenge, parseLines } from "./common.js";
import { JsonMap } from "./jsonMap.js";

type Die = () => number[];

function createCountingDie(): Die {
	let count = 0;
	return () => [(count++ % 100) + 1];
}

function create123Die(): Die {
	return () => [1, 2, 3];
}

type DiracDiceState = {
	scores: number[];
	positions: number[];
	turns: number;
	complete: boolean;
};

type QuantumDiracDiceState = JsonMap<DiracDiceState, number>;

function isComplete(quantumState: QuantumDiracDiceState): boolean {
	return Array.from(quantumState.keys()).every((state) => state.complete);
}

function totalWins(
	quantumState: QuantumDiracDiceState,
	player: number
): number {
	return Array.from(quantumState.entries()).reduce((total, [state, count]) => {
		if (winningPlayer(state) === player) {
			return total + count;
		} else {
			return total;
		}
	}, 0);
}

function takeTurn(
	quantumState: QuantumDiracDiceState,
	die: Die,
	winningScore: number
): QuantumDiracDiceState {
	const nextQunatumState: QuantumDiracDiceState = new JsonMap();
	for (const [state, count] of quantumState.entries()) {
		if (state.complete) {
			nextQunatumState.set(state, count);
			continue;
		}
		const player = state.turns % 2;
		const startPosition = state.positions[player];
		for (const roll1 of die()) {
			for (const roll2 of die()) {
				for (const roll3 of die()) {
					const rollTotal = roll1 + roll2 + roll3;
					const endPosition = (startPosition + rollTotal) % 10;
					const scores = [...state.scores];
					const positions = [...state.positions];
					scores[player] += endPosition + 1;
					positions[player] = endPosition;
					const complete = scores[player] >= winningScore;
					const nextState = {
						scores,
						positions,
						turns: state.turns + 1,
						complete,
					};
					nextQunatumState.set(
						nextState,
						count + nextQunatumState.getOrDefault(nextState, 0)
					);
				}
			}
		}
	}
	return nextQunatumState;
}

function winningPlayer(state: DiracDiceState): number {
	const topScore = Math.max(...state.scores);
	return state.scores.findIndex((score) => score === topScore);
}

function losingPlayer(state: DiracDiceState): number {
	const topScore = Math.max(...state.scores);
	return state.scores.findIndex((score) => score !== topScore);
}

function parseInput(input: string): DiracDiceState {
	const [line1, line2] = parseLines(input);
	const [_1, start1] = line1.match(
		/Player 1 starting position: (\d+)/
	) as string[];
	const [_2, start2] = line2.match(
		/Player 2 starting position: (\d+)/
	) as string[];
	return {
		scores: [0, 0],
		positions: [parseInt(start1) - 1, parseInt(start2) - 1],
		turns: 0,
		complete: false,
	};
}

challenge({ day: 21, part: 1 }, (input) => {
	const initialState = parseInput(input);
	const die = createCountingDie();
	let quantumState: QuantumDiracDiceState = new JsonMap();
	quantumState.set(initialState, 1);
	while (!isComplete(quantumState)) {
		quantumState = takeTurn(quantumState, die, 1000);
	}
	const [finalState] = quantumState.keys();
	const losingScore = finalState.scores[losingPlayer(finalState)];
	return losingScore * finalState.turns * 3;
});

challenge({ day: 21, part: 2 }, (input) => {
	const initialState = parseInput(input);
	const die = create123Die();
	let quantumState: QuantumDiracDiceState = new JsonMap();
	quantumState.set(initialState, 1);
	while (!isComplete(quantumState)) {
		quantumState = takeTurn(quantumState, die, 21);
	}
	return Math.max(totalWins(quantumState, 0), totalWins(quantumState, 1));
});
