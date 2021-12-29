export class Heap<T> {
	private data: T[] = [];

	constructor(private comparator: (a: T, b: T) => number) {}

	get size(): number {
		return this.data.length;
	}

	*values(): Generator<T> {
		for (const value of this.data) {
			yield value;
		}
	}

	push(...values: T[]) {
		for (const value of values) {
			this.data.push(value);
			this.bubbleUp();
		}
	}

	peek(): T | undefined {
		return this.data[0];
	}

	pop(): T | undefined {
		const value = this.data[0];
		this.data[0] = this.data[this.data.length - 1];
		this.data.pop();
		this.bubbleDown();
		return value;
	}

	private swap(index1: number, index2: number) {
		const tmp = this.data[index1];
		this.data[index1] = this.data[index2];
		this.data[index2] = tmp;
	}

	private indirectComparator(index1: number, index2: number): number {
		return this.comparator(this.data[index1], this.data[index2]);
	}

	bubbleUp() {
		let index = this.data.length - 1;
		let parentIndex = ((index + 1) >>> 1) - 1;
		while (index > 0 && this.indirectComparator(index, parentIndex) > 0) {
			this.swap(index, parentIndex);
			index = parentIndex;
			parentIndex = ((index + 1) >>> 1) - 1;
		}
	}

	bubbleDown() {
		let index = 0;
		let leftIndex = (index << 1) + 1;
		let rightIndex = (index + 1) << 1;
		while (
			(leftIndex < this.data.length &&
				this.indirectComparator(leftIndex, index) > 0) ||
			(rightIndex < this.data.length &&
				this.indirectComparator(rightIndex, index) > 0)
		) {
			const maxIndex =
				rightIndex < this.data.length &&
				this.indirectComparator(rightIndex, leftIndex) > 0
					? rightIndex
					: leftIndex;
			this.swap(index, maxIndex);
			index = maxIndex;
			leftIndex = (index << 1) + 1;
			rightIndex = (index + 1) << 1;
		}
	}
}
