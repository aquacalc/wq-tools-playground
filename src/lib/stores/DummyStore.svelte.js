const STORAGE_KEY = 'dummy_store_value';
const DEFAULT_VALUE = 0.15;

export class DummyStore {
	// Initialize with the $state rune
	myWqValue = $state(0);

	constructor() {
		let initialVal = DEFAULT_VALUE;

		// Ensure safe execution during Server-Side Rendering (SSR) like SvelteKit
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored !== null) {
				const parsed = parseFloat(stored);
				if (!isNaN(parsed)) {
					initialVal = parsed;
				}
			}
		}
	}

	/** @param {number} val */
	set(val) {
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, val.toString());
		}

		// Directly assign values in Svelte 5
		this.myWqValue = val;
	}

	get value() {
		// Read directly; no .current needed
		return this.myWqValue;
	}
}

export const dummyStore = new DummyStore();
