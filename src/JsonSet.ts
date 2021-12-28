const JsonValue = Symbol("Symbol.JsonValue");

export class JsonSet<T> {
	private jsonToValue: Map<string, T> = new Map();

	get size(): number {
		return this.jsonToValue.size;
	}

	values(): IterableIterator<T> {
		return this.jsonToValue.values();
	}

	has(value: T): boolean {
		const cachedJsonValue = (value as any)[JsonValue];
		if (cachedJsonValue !== undefined) {
			return this.jsonToValue.has(cachedJsonValue);
		}
		const jsonKey = JSON.stringify(value);
		(value as any)[JsonValue] = jsonKey;
		return this.jsonToValue.has(jsonKey);
	}

	add(value: T) {
		const cachedJsonValue = (value as any)[JsonValue];
		if (cachedJsonValue !== undefined) {
			this.jsonToValue.set(cachedJsonValue, value);
		}
		const jsonKey = JSON.stringify(value);
		(value as any)[JsonValue] = jsonKey;
		this.jsonToValue.set(jsonKey, value);
	}

	delete(value: T): boolean {
		const cachedJsonValue = (value as any)[JsonValue];
		if (cachedJsonValue !== undefined) {
			return this.jsonToValue.delete(cachedJsonValue);
		}
		const jsonValue = JSON.stringify(value);
		(value as any)[JsonValue] = jsonValue;
		return this.jsonToValue.delete(jsonValue);
	}
}
