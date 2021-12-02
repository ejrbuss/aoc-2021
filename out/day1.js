import { challenge, parseNumbers } from "./common.js";
function countIncreases(depths) {
    let previousDepth = Infinity;
    let increases = 0;
    for (const depth of depths) {
        if (depth > previousDepth) {
            increases += 1;
        }
        previousDepth = depth;
    }
    return increases;
}
function slidingWindows(depths) {
    const windows = [];
    for (let i = 0; i + 2 < depths.length; i += 1) {
        windows.push(depths[i] + depths[i + 1] + depths[i + 2]);
    }
    return windows;
}
challenge({ day: 1, part: 1 }, (input) => {
    const depths = parseNumbers(input);
    return countIncreases(depths);
});
challenge({ day: 1, part: 2 }, (input) => {
    const depths = parseNumbers(input);
    const windows = slidingWindows(depths);
    return countIncreases(windows);
});
