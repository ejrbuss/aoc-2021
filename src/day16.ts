import { challenge } from "./common.js";

type BitsString = string;

function fromBits(bits: string): number {
	return parseInt(bits, 2);
}

type BitsStringScanner = {
	bitsString: BitsString;
	position: number;
};

function scan(scanner: BitsStringScanner, length: number): string {
	const start = scanner.position;
	const end = scanner.position + length;
	scanner.position = end;
	return scanner.bitsString.substring(start, end);
}

type Literal = {
	version: number;
	typeId: 4;
	value: number;
};

type Operator = {
	version: number;
	typeId: number;
	lengthTypeId: number;
	length: number;
	subPackets: Packet[];
};

type Packet = Literal | Operator;

const HexToBits: Record<string, string> = {
	[0]: "0000",
	[1]: "0001",
	[2]: "0010",
	[3]: "0011",
	[4]: "0100",
	[5]: "0101",
	[6]: "0110",
	[7]: "0111",
	[8]: "1000",
	[9]: "1001",
	A: "1010",
	B: "1011",
	C: "1100",
	D: "1101",
	E: "1110",
	F: "1111",
};

function parseInput(input: string): BitsString {
	const bitsStringParts: string[] = [];
	for (const hex of input.split("")) {
		bitsStringParts.push(HexToBits[hex]);
	}
	return bitsStringParts.join("");
}

function parsePacket(scanner: BitsStringScanner): Packet {
	const version = fromBits(scan(scanner, 3));
	const typeId = fromBits(scan(scanner, 3));
	// Parse Literal
	if (typeId === 4) {
		const valueParts: string[] = [];
		for (;;) {
			const lastPart = scan(scanner, 1) === "0";
			valueParts.push(scan(scanner, 4));
			if (lastPart) {
				break;
			}
		}
		const value = fromBits(valueParts.join(""));
		return { version, typeId, value };
	}
	// Parse Operator
	const lengthTypeId = fromBits(scan(scanner, 1));
	const length = fromBits(scan(scanner, lengthTypeId === 0 ? 15 : 11));
	const subPackets: Packet[] = [];
	if (lengthTypeId === 0) {
		const subPacketsStart = scanner.position;
		const subPacketsEnd = subPacketsStart + length;
		while (scanner.position < subPacketsEnd) {
			subPackets.push(parsePacket(scanner));
		}
	}
	if (lengthTypeId === 1) {
		while (subPackets.length < length) {
			subPackets.push(parsePacket(scanner));
		}
	}
	return {
		version,
		typeId,
		lengthTypeId,
		length,
		subPackets,
	};
}

function totalVersion(packet: Packet): number {
	let version = packet.version;
	if ("subPackets" in packet) {
		for (const subPacket of packet.subPackets) {
			version += totalVersion(subPacket);
		}
	}
	return version;
}

function interpPacket(packet: Packet): number {
	if ("value" in packet) {
		return packet.value;
	}
	// Sum packet
	if (packet.typeId === 0) {
		let sum = 0;
		for (const subPacket of packet.subPackets) {
			sum += interpPacket(subPacket);
		}
		return sum;
	}
	// Product packet
	if (packet.typeId === 1) {
		let product = 1;
		for (const subPacket of packet.subPackets) {
			product *= interpPacket(subPacket);
		}
		return product;
	}
	// Minimum packet
	if (packet.typeId === 2) {
		let minimum = Infinity;
		for (const subPacket of packet.subPackets) {
			minimum = Math.min(minimum, interpPacket(subPacket));
		}
		return minimum;
	}
	// Maximum packet
	if (packet.typeId === 3) {
		let maximum = -Infinity;
		for (const subPacket of packet.subPackets) {
			maximum = Math.max(maximum, interpPacket(subPacket));
		}
		return maximum;
	}
	// Greater than packet
	if (packet.typeId === 5) {
		const [firstPacket, secondPacket] = packet.subPackets;
		return interpPacket(firstPacket) > interpPacket(secondPacket) ? 1 : 0;
	}
	// Less than packet
	if (packet.typeId === 6) {
		const [firstPacket, secondPacket] = packet.subPackets;
		return interpPacket(firstPacket) < interpPacket(secondPacket) ? 1 : 0;
	}
	// Equal to packet
	if (packet.typeId === 7) {
		const [firstPacket, secondPacket] = packet.subPackets;
		return interpPacket(firstPacket) === interpPacket(secondPacket) ? 1 : 0;
	}
	throw new Error("Unrecognized typeId!");
}

challenge({ day: 16, part: 1 }, (input) => {
	const bitsString = parseInput(input);
	const scanner = { bitsString, position: 0 };
	const packet = parsePacket(scanner);
	return totalVersion(packet);
});

challenge({ day: 16, part: 2 }, (input) => {
	const bitsString = parseInput(input);
	const scanner = { bitsString, position: 0 };
	const packet = parsePacket(scanner);
	return interpPacket(packet);
});
