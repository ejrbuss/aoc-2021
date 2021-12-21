import { challenge, parseLines } from "./common.js";

type Algorithm = string;

type Pixel = string;

type Sample = Pixel[];

type Image = {
	data: Pixel[][];
	void: Pixel;
	width: number;
	height: number;
};

const LightPixel: Pixel = "#";
const DarkPixel: Pixel = ".";

function voidSample(image: Image): Sample {
	return new Array(9).fill(image.void);
}

function samplePixel(x: number, y: number, image: Image): Sample {
	const sample: Sample = [];
	for (let dy = -1; dy <= 1; dy += 1) {
		for (let dx = -1; dx <= 1; dx += 1) {
			if (inBounds(x + dx, y + dy, image)) {
				sample.push(image.data[y + dy][x + dx]);
			} else {
				sample.push(image.void);
			}
		}
	}
	return sample;
}

function inBounds(x: number, y: number, image: Image): boolean {
	return 0 <= x && x < image.width && 0 <= y && y < image.height;
}

function enhanceSample(sample: Sample, algorithm: Algorithm): Pixel {
	const digits: string[] = [];
	for (const pixel of sample) {
		digits.push(pixel === LightPixel ? "1" : "0");
	}
	return algorithm[parseInt(digits.join(""), 2)];
}

function pixelCount(image: Image, pixel: Pixel): number {
	let count = 0;
	for (let y = 0; y < image.height; y += 1) {
		for (let x = 0; x < image.width; x += 1) {
			if (image.data[y][x] === pixel) {
				count += 1;
			}
		}
	}
	return count;
}

function parseInput(input: string): [Algorithm, Image] {
	const lines = parseLines(input);
	const algorithm = lines.shift() as Algorithm;
	const data = lines.map((line) => line.split(""));
	const width = data[0].length;
	const height = data.length;
	const image = { data, width, height, void: DarkPixel };
	return [algorithm, image];
}

function expandImage(image: Image): Image {
	const data: string[][] = [];
	const width = image.width + 2;
	const height = image.height + 2;
	const voidPixels = new Array(width).fill(image.void);
	data.push(voidPixels);
	for (const pixels of image.data) {
		data.push([image.void, ...pixels, image.void]);
	}
	data.push(voidPixels);
	return { data, width, height, void: image.void };
}

function copyImage(image: Image): Image {
	return {
		data: image.data.map((pixels) => [...pixels]),
		void: image.void,
		width: image.width,
		height: image.height,
	};
}

function enhanceImage(image: Image, algorithm: Algorithm): Image {
	const expandedImage = expandImage(image);
	const enhancedImage = copyImage(expandedImage);
	enhancedImage.void = enhanceSample(voidSample(expandedImage), algorithm);
	for (let y = 0; y < expandedImage.height; y += 1) {
		for (let x = 0; x < expandedImage.width; x += 1) {
			enhancedImage.data[y][x] = enhanceSample(
				samplePixel(x, y, expandedImage),
				algorithm
			);
		}
	}
	return enhancedImage;
}

challenge({ day: 20, part: 1 }, (input) => {
	let [algorithm, image] = parseInput(input);
	for (let i = 0; i < 2; i += 1) {
		image = enhanceImage(image, algorithm);
	}
	return pixelCount(image, LightPixel);
});

challenge({ day: 20, part: 2 }, (input) => {
	let [algorithm, image] = parseInput(input);
	for (let i = 0; i < 50; i += 1) {
		image = enhanceImage(image, algorithm);
	}
	return pixelCount(image, LightPixel);
});
