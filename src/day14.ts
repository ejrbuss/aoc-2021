import { challenge, max, min, parseLines } from "./common.js";

type Encoding = string[];

function createEncoding(charSet: Set<string>): Encoding {
	return Array.from(charSet);
}

function encode(encoding: Encoding, char: string): number {
	return encoding.indexOf(char) + 1;
}

const ChunkSize = 1 << 20;

type CodeString = {
	currentChunk: number;
	currentOffset: number;
	chunks: Uint8Array[];
};

function createCodeString(): CodeString {
	return {
		currentChunk: 0,
		currentOffset: 0,
		chunks: [new Uint8Array(ChunkSize)],
	};
}

function reset(codeString: CodeString) {
	codeString.currentChunk = 0;
	codeString.currentOffset = 0;
}

function appendCode(codeString: CodeString, code: number) {
	codeString.chunks[codeString.currentChunk][codeString.currentOffset++] = code;
	if (codeString.currentOffset === ChunkSize) {
		codeString.currentChunk += 1;
		codeString.currentOffset = 0;
		if (codeString.currentChunk >= codeString.chunks.length) {
			codeString.chunks.push(new Uint8Array(ChunkSize));
		}
	}
}

function getCode(codeString: CodeString, position: number): number {
	const chunk = Math.floor(position / ChunkSize);
	const offset = position % ChunkSize;
	return codeString.chunks[chunk][offset];
}

function lengthOfCodeString(codeString: CodeString): number {
	return ChunkSize * codeString.currentChunk + codeString.currentOffset;
}

function checksum(codeString: CodeString) {
	const length = lengthOfCodeString(codeString);
	const codeCounts: Record<number, number> = {};
	for (let i = 0; i < length; i += 1) {
		const char = getCode(codeString, i);
		codeCounts[char] = (codeCounts[char] ?? 0) + 1;
	}
	const counts = Object.values(codeCounts);
	return max(counts) - min(counts);
}

type PairRules = Record<number, number>;

function createPairRules(): PairRules {
	return {};
}

function addRule(
	pairRules: PairRules,
	left: number,
	right: number,
	insertion: number
) {
	pairRules[left | (right << 4)] = insertion;
}

function getInsertion(
	pairRules: PairRules,
	left: number,
	right: number
): number | undefined {
	return pairRules[left | (right << 4)];
}

function parseInput(input: string): {
	template: CodeString;
	pairRules: PairRules;
} {
	const lines = parseLines(input);
	const stringTemplate = lines.shift() as string;
	const charSet: Set<string> = new Set();
	for (const line of lines) {
		const [left, right, insertion] = line.replace(/\s|->/g, "").split("");
		charSet.add(left);
		charSet.add(right);
		charSet.add(insertion);
	}
	const encoding = createEncoding(charSet);
	const template = createCodeString();
	const pairRules = createPairRules();
	for (const char of Array.from(stringTemplate)) {
		appendCode(template, encode(encoding, char));
	}
	for (const line of lines) {
		const [left, right, insertion] = line.replace(/\s|->/g, "").split("");
		addRule(
			pairRules,
			encode(encoding, left),
			encode(encoding, right),
			encode(encoding, insertion)
		);
	}
	return { template, pairRules };
}

function step(
	inString: CodeString,
	outString: CodeString,
	pairRules: PairRules
) {
	const length = lengthOfCodeString(inString);
	let previousCode = getCode(inString, 0);
	appendCode(outString, previousCode);
	for (let i = 1; i < length; i += 1) {
		const code = getCode(inString, i);
		const insertion = getInsertion(pairRules, previousCode, code);
		if (insertion !== undefined) {
			appendCode(outString, insertion);
		}
		appendCode(outString, code);
		previousCode = code;
	}
}

challenge({ day: 14, part: 1 }, (input) => {
	let { template, pairRules } = parseInput(input);
	let inString = template;
	let outString = createCodeString();
	for (let i = 0; i < 10; i += 1) {
		step(inString, outString, pairRules);
		const tmp = inString;
		inString = outString;
		outString = tmp;
		reset(outString);
	}
	return checksum(inString);
});

challenge({ day: 14, part: 2 }, (input) => {
	let { template, pairRules } = parseInput(input);
	let inString = template;
	let outString = createCodeString();
	for (let i = 0; i < 40; i += 1) {
		console.log(`Step: ${i} Length: ${lengthOfCodeString(inString)}`);
		step(inString, outString, pairRules);
		const tmp = inString;
		inString = outString;
		outString = tmp;
	}
	return checksum(inString);
});
