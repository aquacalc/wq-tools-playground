// localStorage Persistence: Automatically saves the target value whenever set() is called and retrieves it upon instantiation. Target values are stored rather than mid-animation frame values to avoid excessive disk writes and jitter.
// SSR Safety Guards: Added typeof window !== 'undefined' checks around all localStorage calls so the module won't crash your app if rendered on a server (e.g., in SvelteKit).
// Safe Parsing: Validates parsed storage items with isNaN() to prevent NaN bugs if localStorage data becomes corrupted or malformed.
// Constants Extraction: Moved configuration strings and fallback values into clean module-scoped constants (STORAGE_KEY, DEFAULT_VALUE).

import { cubicOut } from 'svelte/easing';
import { Tween } from 'svelte/motion';

const STORAGE_KEY = 'tan_store_value';
const DEFAULT_VALUE = 0.15;

export class TanStore {
	#tween;

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

		// Initialize the tween with the stored value or fallback
		this.#tween = new Tween(initialVal, { duration: 750, easing: cubicOut });
	}

	/**
	 * Sets a new TAN value and persists it to localStorage.
	 * @param {number} val
	 */
	set(val) {
		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, val.toString());
		}
		void this.#tween.set(val);
	}

	/** The current (animated) TAN value, in mg/L. Reactive: reads update as the tween runs. */
	get value() {
		return Number(this.#tween.current.toFixed(2));
	}
}

export const tanStore = new TanStore();
