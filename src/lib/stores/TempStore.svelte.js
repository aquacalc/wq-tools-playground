import { cubicOut } from 'svelte/easing';
import { Tween } from 'svelte/motion';

const STORAGE_KEY = 'temp_store_value';
const DEFAULT_VALUE = 28;

export class TempStore {
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

	get value() {
		return Number(this.#tween.current.toFixed(1));
	}
}

export const tempStore = new TempStore();
