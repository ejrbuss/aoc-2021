import { challenge, chunk, parseLines } from "./common.js";
const WinningMasks = [
    // horizontal
    0b11111_00000_00000_00000_00000, 0b00000_11111_00000_00000_00000,
    0b00000_00000_11111_00000_00000, 0b00000_00000_00000_11111_00000,
    0b00000_00000_00000_00000_11111,
    // vertical
    0b10000_10000_10000_10000_10000, 0b01000_01000_01000_01000_01000,
    0b00100_00100_00100_00100_00100, 0b00010_00010_00010_00010_00010,
    0b00001_00001_00001_00001_00001,
];
function parseInput(input) {
    const lines = parseLines(input);
    const numbers = lines.shift()
        .trim()
        .split(",")
        .map((n) => parseInt(n));
    const boards = chunk(lines.filter((line) => line.length), 5).map((boardLines) => boardLines
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .map((n) => parseInt(n)));
    return { boards, numbers: numbers };
}
function computeResult(board, numbers) {
    const numberToIndex = {};
    board.forEach((number, index) => {
        numberToIndex[number] = index;
    });
    let marked = 0;
    const moves = numbers.findIndex((number) => {
        if (number in numberToIndex) {
            marked |= 1 << numberToIndex[number];
        }
        return check(marked);
    });
    let sum = 0;
    board.forEach((number, index) => {
        if ((marked & (1 << index)) === 0) {
            sum += number;
        }
    });
    return { moves, score: sum * numbers[moves] };
}
function check(marked) {
    return WinningMasks.some((mask) => (marked & mask) === mask);
}
challenge({ day: 4, part: 1 }, (input) => {
    const { boards, numbers } = parseInput(input);
    const results = boards.map((board) => computeResult(board, numbers));
    let winningMoves = Infinity;
    let winningScore = Infinity;
    for (const result of results) {
        if (result.moves < winningMoves) {
            winningMoves = result.moves;
            winningScore = result.score;
        }
    }
    return winningScore;
});
challenge({ day: 4, part: 2 }, (input) => {
    const { boards, numbers } = parseInput(input);
    const results = boards.map((board) => computeResult(board, numbers));
    let winningMoves = -Infinity;
    let winningScore = -Infinity;
    for (const result of results) {
        if (result.moves > winningMoves) {
            winningMoves = result.moves;
            winningScore = result.score;
        }
    }
    return winningScore;
});
