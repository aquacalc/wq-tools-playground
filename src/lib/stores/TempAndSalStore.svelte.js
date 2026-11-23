import { Tween } from 'svelte/motion';

class TempAndSal {
	tempC;
	sal;

	get tempF() {
		return this.tempC.current * 1.8 + 32;
	}

	/** @param {number} val */
	set(val) {
		void this.tempC.set(val);
		void this.sal.set(val);
	}

	/**
	 * @param {number} tempC
	 * @param {number} sal
	 */
	constructor(tempC, sal) {
		this.tempC = new Tween(tempC, { duration: 350 });
		this.sal = new Tween(sal, { duration: 350 });
	}

	async fetchIonicStrength() {
		let result = null;
		let error = null;
		try {
			const response = await fetch('/api/carb-calc-test', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer gimme-the-IS'
				},
				body: JSON.stringify({
					// tempC: this.tempC,
					sal: this.sal.current
				})
			});

			const data = /** @type {{ ionicStrength?: number, error?: string }} */ (
				await /** @type {Promise<unknown>} */ (response.json())
			);

			if (response.ok) {
				result = data.ionicStrength;
			} else {
				error = data.error;
			}
		} catch (err) {
			error = `An error occurred while fetching the ionic strength. ${String(err)}`;
		}

		return { result, error };
	}
}

export const tempAndSal = new TempAndSal(15, 34.5);
