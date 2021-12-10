import { challenge, parseLines } from "./common.js";
const Digits = [
    "abcefg",
    "cf",
    "acdeg",
    "acdfg",
    "bcdf",
    "abdfg",
    "abdefg",
    "acf",
    "abcdefg",
    "abcdfg",
];
const InitialEncodings = {
    a: "abcdefg",
    b: "abcdefg",
    c: "abcdefg",
    d: "abcdefg",
    e: "abcdefg",
    f: "abcdefg",
    g: "abcdefg",
};
function intersection(s1, s2) {
    let intersection = "";
    for (let i = 0; i < s1.length; i += 1) {
        const char = s1.charAt(i);
        if (s2.includes(char)) {
            intersection += char;
        }
    }
    return sortString(intersection);
}
function sortString(s) {
    return s.split("").sort().join("");
}
function parseInput(input) {
    const signalLines = [];
    for (const line of parseLines(input)) {
        const [encodedDigits, outputDigits] = line.split("|");
        signalLines.push({
            encodedDigits: encodedDigits.trim().split(" ").map(sortString),
            outputDigits: outputDigits.trim().split(" ").map(sortString),
        });
    }
    return signalLines;
}
function determineAssignments(encodedDigits, digits, assignments, encodings) {
    while (encodedDigits.length) {
        const encodedDigit = encodedDigits.shift();
        const possibleDigits = determinePossibleDigits(encodedDigit, digits, encodings);
        if (possibleDigits.length === 1) {
            const digit = possibleDigits[0];
            assignments[encodedDigit] = digit;
            digits = digits.filter((d) => d !== digit);
            for (let i = 0; i < encodedDigit.length; i += 1) {
                const encodedLetter = encodedDigit.charAt(i);
                encodings[encodedLetter] = intersection(encodings[encodedLetter], digit);
            }
        }
        else {
            encodedDigits.push(encodedDigit);
        }
    }
    return assignments;
}
function determinePossibleDigits(encodedDigit, digits, encodings) {
    return digits.filter((digit) => isPossibleDigit(digit, encodedDigit, encodings));
}
function isPossibleDigit(digit, encodedDigit, encodings) {
    if (digit.length !== encodedDigit.length) {
        return false;
    }
    // Base case
    if (digit.length === 1) {
        const letter = digit.charAt(0);
        const encodedLetter = encodedDigit.charAt(0);
        return encodings[encodedLetter].includes(letter);
    }
    const letter = digit.charAt(0);
    const restDigit = digit.substr(1);
    for (let i = 0; i < encodedDigit.length; i += 1) {
        const encodedLetter = encodedDigit[i];
        if (encodings[encodedLetter].includes(letter)) {
            const restEncodedDigit = encodedDigit.substring(0, i) + encodedDigit.substring(i + 1);
            if (isPossibleDigit(restDigit, restEncodedDigit, encodings)) {
                return true;
            }
        }
    }
    return false;
}
function decode(encodedDigit, assignments) {
    return Digits.indexOf(assignments[encodedDigit]);
}
challenge({ day: 8, part: 1 }, (input) => {
    const signalLines = parseInput(input);
    let sum = 0;
    for (const signalLine of signalLines) {
        const assignments = determineAssignments([...signalLine.encodedDigits], [...Digits], {}, { ...InitialEncodings });
        for (const encodedDigit of signalLine.outputDigits) {
            const value = decode(encodedDigit, assignments);
            if ([1, 4, 7, 8].includes(value)) {
                sum += 1;
            }
        }
    }
    return sum;
});
challenge({ day: 8, part: 2 }, (input) => {
    const signalLines = parseInput(input);
    let sum = 0;
    for (const signalLine of signalLines) {
        const assignments = determineAssignments([...signalLine.encodedDigits], [...Digits], {}, { ...InitialEncodings });
        let output = "";
        for (const encodedDigit of signalLine.outputDigits) {
            output += decode(encodedDigit, assignments);
        }
        sum += parseInt(output);
    }
    return sum;
});
