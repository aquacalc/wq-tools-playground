const STORAGE_KEY = 'sal_store_value';
const DEFAULT_VALUE = 34.5;

export class SalStore {
	myWqValue = $state(DEFAULT_VALUE);

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

	/**
	 * Sets a new TAN value and persists it to localStorage.
	 * @param {number} val
	 */
	set(val) {
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, val.toString());
		}
		this.myWqValue = val;
	}

	get value() {
		return this.myWqValue;
	}
}

export const salStore = new SalStore();
