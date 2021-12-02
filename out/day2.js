import { challenge, parseRegExp } from "./common.js";
var MoveType;
(function (MoveType) {
    MoveType[MoveType["Forward"] = 0] = "Forward";
    MoveType[MoveType["Down"] = 1] = "Down";
    MoveType[MoveType["Up"] = 2] = "Up";
})(MoveType || (MoveType = {}));
const NameToMoveType = {
    forward: MoveType.Forward,
    down: MoveType.Down,
    up: MoveType.Up,
};
function parseInput(input) {
    return parseRegExp(input, /(\w+)\s+(\d+)/).map(([_, name, x]) => [
        NameToMoveType[name],
        parseInt(x),
    ]);
}
challenge({ day: 2, part: 1 }, (input) => {
    const moves = parseInput(input);
    let dx = 0;
    let dy = 0;
    for (const [type, x] of moves) {
        ({
            [MoveType.Forward]: () => (dx += x),
            [MoveType.Down]: () => (dy += x),
            [MoveType.Up]: () => (dy -= x),
        }[type]());
    }
    return dx * dy;
});
challenge({ day: 2, part: 2 }, (input) => {
    const moves = parseInput(input);
    let aim = 0;
    let dx = 0;
    let dy = 0;
    for (const [type, x] of moves) {
        ({
            [MoveType.Forward]: () => ((dx += x), (dy += aim * x)),
            [MoveType.Down]: () => (aim += x),
            [MoveType.Up]: () => (aim -= x),
        }[type]());
    }
    return dx * dy;
});
