// localStorage Persistence: Automatically saves the target value whenever set() is called and retrieves it upon instantiation. Target values are stored rather than mid-animation frame values to avoid excessive disk writes and jitter.
// SSR Safety Guards: Added typeof window !== 'undefined' checks around all localStorage calls so the module won't crash your app if rendered on a server (e.g., in SvelteKit).
// Safe Parsing: Validates parsed storage items with isNaN() to prevent NaN bugs if localStorage data becomes corrupted or malformed.
// Constants Extraction: Moved configuration strings and fallback values into clean module-scoped constants (STORAGE_KEY, DEFAULT_VALUE).

const STORAGE_KEY = 'ph_store_value';
const DEFAULT_VALUE = 7.5;

export class PhStore {
	// Initialize with the $state rune
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
		
		this.myWqValue = initialVal;
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

export const phStore = new PhStore();
