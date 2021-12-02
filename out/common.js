export const Challenges = {};
export function challenge(spec, impl) {
    Challenges[spec.day + "." + spec.part] = impl;
}
export function parseLines(input) {
    return input.trim().split("\n");
}
export function parseNumbers(input) {
    return parseLines(input).map((line) => parseInt(line));
}
export function parseRegExp(input, regExp) {
    return parseLines(input).map((line) => line.match(regExp));
}
