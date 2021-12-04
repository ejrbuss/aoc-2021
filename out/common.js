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
export function chunk(array, n) {
    const length = array.length;
    const chunks = [];
    let chunk = [];
    for (let i = 0; i < length; i += 1) {
        chunk.push(array[i]);
        if (chunk.length === n) {
            chunks.push(chunk);
            chunk = [];
        }
    }
    if (chunk.length) {
        chunks.push(chunk);
    }
    return chunks;
}
export function zipWith(array1, array2, f) {
    const length = Math.max(array1.length, array2.length);
    const acc = [];
    for (let i = 0; i < length; i += 1) {
        acc.push(f(array1[i], array2[i], i));
    }
    return acc;
}
