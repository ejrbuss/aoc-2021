const JsonKey = Symbol("Symbol.JsonKey");

export class JsonMap<K, V> {
	private jsonToValue: Map<string, V> = new Map();
	private jsonToKey: Map<string, K> = new Map();

	get size(): number {
		return this.jsonToValue.size;
	}

	keys(): IterableIterator<K> {
		return this.jsonToKey.values();
	}

	values(): IterableIterator<V> {
		return this.jsonToValue.values();
	}

	*entries(): Generator<[K, V]> {
		const keysIter = this.jsonToKey.values();
		const valuesIter = this.jsonToValue.values();
		let nextKey = keysIter.next();
		let nextValue = valuesIter.next();
		while (!nextKey.done) {
			yield [nextKey.value, nextValue.value];
			nextKey = keysIter.next();
			nextValue = valuesIter.next();
		}
	}

	get(key: K): V | undefined {
		const cachedJsonKey = (key as any)[JsonKey];
		if (cachedJsonKey !== undefined) {
			return this.jsonToValue.get(cachedJsonKey);
		}
		const jsonKey = JSON.stringify(key);
		(key as any)[JsonKey] = jsonKey;
		return this.jsonToValue.get(jsonKey);
	}

	getOrDefault<T>(key: K, otherwise: T): V | T {
		const cachedJsonKey = (key as any)[JsonKey];
		if (cachedJsonKey !== undefined) {
			return this.jsonToValue.get(cachedJsonKey) ?? otherwise;
		}
		const jsonKey = JSON.stringify(key);
		(key as any)[JsonKey] = jsonKey;
		return this.jsonToValue.get(jsonKey) ?? otherwise;
	}

	has(key: K): boolean {
		const cachedJsonKey = (key as any)[JsonKey];
		if (cachedJsonKey !== undefined) {
			return this.jsonToValue.has(cachedJsonKey);
		}
		const jsonKey = JSON.stringify(key);
		(key as any)[JsonKey] = jsonKey;
		return this.jsonToValue.has(jsonKey);
	}

	set(key: K, value: V) {
		const cachedJsonKey = (key as any)[JsonKey];
		if (cachedJsonKey !== undefined) {
			this.jsonToValue.set(cachedJsonKey, value);
			this.jsonToKey.set(cachedJsonKey, key);
		}
		const jsonKey = JSON.stringify(key);
		(key as any)[JsonKey] = jsonKey;
		this.jsonToValue.set(jsonKey, value);
		this.jsonToKey.set(jsonKey, key);
	}

	delete(key: K): boolean {
		const cachedJsonKey = (key as any)[JsonKey];
		if (cachedJsonKey !== undefined) {
			this.jsonToValue.delete(cachedJsonKey);
			return this.jsonToKey.delete(cachedJsonKey);
		}
		const jsonKey = JSON.stringify(key);
		(key as any)[JsonKey] = jsonKey;
		this.jsonToValue.delete(jsonKey);
		return this.jsonToKey.delete(jsonKey);
	}
}
