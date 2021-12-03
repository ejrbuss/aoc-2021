import { challenge, parseLines, zipWith } from "./common.js";
function parseInput(input) {
    return parseLines(input).map((line) => line.split("").map((digit) => parseInt(digit)));
}
function toNumber(binStr) {
    return parseInt(binStr.join(""), 2);
}
function count(diagnostics) {
    return diagnostics.reduce((counts, diagnostic) => {
        return zipWith(counts, diagnostic, (a, b) => a + b);
    });
}
function gamma(diagnostics) {
    return count(diagnostics).map((count) => {
        return Math.round(count / diagnostics.length);
    });
}
function epsilon(diagnostics) {
    return count(diagnostics).map((count) => {
        return Math.round(count / diagnostics.length) ? 0 : 1;
    });
}
challenge({ day: 3, part: 1 }, (input) => {
    const diagnostics = parseInput(input);
    return toNumber(gamma(diagnostics)) * toNumber(epsilon(diagnostics));
});
challenge({ day: 3, part: 2 }, (input) => {
    const diagnostics = parseInput(input);
    const counts = count(diagnostics);
    let oxygen = diagnostics;
    for (const i in counts) {
        if (oxygen.length === 1) {
            break;
        }
        const oxygenGamma = gamma(oxygen);
        oxygen = oxygen.filter((diagnostic) => diagnostic[i] === oxygenGamma[i]);
    }
    let c02 = diagnostics;
    for (const i in counts) {
        if (c02.length === 1) {
            break;
        }
        const c02Epsilon = epsilon(c02);
        c02 = c02.filter((diagnostic) => diagnostic[i] === c02Epsilon[i]);
    }
    return toNumber(oxygen[0]) * toNumber(c02[0]);
});
