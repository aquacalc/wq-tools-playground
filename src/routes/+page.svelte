<script lang="ts">
	import { tanStore } from '#lib/stores/TanStore.svelte.js';
	import { tempStore } from '#lib/stores/TempStore.svelte.js';
	import { phStore } from '#lib/stores/PhStore.svelte.js';
	import { salStore } from '#lib/stores/SalStore.svelte.js';

	import {
		percentNh3ForTemp,
		critPhFreeForTanMillero,
		phFreeToPhNbs,
		phNbsToPhFree
	} from '#lib/wq-brains/CarbCalcFunctions.js';

	// @ts-expect-error Svelte's generated declaration uses an arbitrary extension.
	import Rect from '#lib/uian/Rect.svelte';

	import SliderText from '#lib/SliderText.svelte';
	import Summary from '#lib/Summary.svelte';

	let posto = $derived.by(() => {
		// ∆ pH NBS to Free scale
		let phFree = phNbsToPhFree(
			phStore.value,
			salStore.value,
			tempStore.value + 273.15,
			0
		) as number;

		let uian =
			(1000 *
				tanStore.value *
				percentNh3ForTemp(tempStore.value + 273.15, salStore.value, phFree)) /
			100;

		return {
			phFree,
			uian
		};
	});

	// Use $derived.by() for multi-step calculations
	let critPh = $derived.by(() => {
		let critPhFree = critPhFreeForTanMillero(
			tanStore.value * 1000, // [NB] mg/L -> µg/L
			uianThreshhold,
			tempStore.value + 273.15,
			salStore.value
		);

		// // [HACK] Like in UiaContent.js, critPh can NaN or +/-Inf
		// //        if TA-N is too low to produce the critical UIA-N
		critPhFree = isNaN(critPhFree) ? 12.0 : critPhFree;
		critPhFree = critPhFree === Infinity ? 12.0 : critPhFree;
		critPhFree = critPhFree === -Infinity ? 5.0 : critPhFree;

		// ∆ critPhFree to critPhNbs
		let critPhNbs = phFreeToPhNbs(critPhFree, salStore.value, tempStore.value + 273.15, 0);

		console.log(`critPhNbs: ${critPhNbs.toFixed(2)} (${phStore.value})`);

		return {
			critPhNbs,
			critPhFree,
			msg: 'Proba!'
		};
	});

	let uianThreshhold = $state(12.5);
</script>

<div class="text-white-700 mt-6 mb-8 flex flex-col items-center text-2xl">
	<h1>Un-ionized Ammonia (µg/L)</h1>
</div>

<section class="flex flex-col items-center">
	<Rect x_pos={uianThreshhold} critUianPos={posto.uian} />

	<label class="range-input-label mt-4 w-[500px]" for="uian" style="text-align: left">
		<input
			id="uian"
			type="range"
			class="w-full cursor-pointer"
			bind:value={uianThreshhold}
			min="0"
			max="50"
			step="0.1"
			list="uian-markers"
		/>

		<datalist id="uian-markers">
			<option value={12.5} label="12.5"></option>
			<option value={30} label="30"></option>
		</datalist>
	</label>

	<div class="mt-10 grid">
		<SliderText
			label="TA-N (mg/L)"
			id="tan"
			store={tanStore}
			max_scale={3}
			step={0.01}
			options={['0.5', '1', '1.5', '2.5']}
		/>
		<SliderText
			label="pH (NBS scale)"
			id="ph"
			store={phStore}
			min_scale={6}
			max_scale={8}
			step={0.01}
			options={['6.5', '7', '7.5', '8']}
		/>
		<SliderText
			label="Temperature (ºC)"
			id="temp"
			store={tempStore}
			min_scale={15}
			max_scale={40}
			options={['20', '25', '30', '35']}
		/>
		<SliderText
			label="Salinity (‰)"
			id="sal"
			store={salStore}
			min_scale={0}
			max_scale={40}
			options={['10', '15', '25', '30']}
		/>
	</div>

	<Summary
		temp={tempStore.value}
		sal={salStore.value}
		ph={phStore.value}
		tan={tanStore.value}
		critPh={critPh.critPhNbs}
		uian={posto.uian}
	/>
</section>

<style>
	/* Outer layout: two columns; four cells wrap into two rows */
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 2rem;
	}

	input[type='range'] {
		accent-color: #ffed29;
		opacity: 0.85;
	}

	/* Breakpoint: below 40rem the outer grid collapses to a single column 
    of four cells. The 1:2 split inside each cell stays. If that is too tight 
    on phones, add .cell { grid-template-columns: 1fr; } inside the same 
    media query. */
	/* Responsive: stack the four cells in one column on narrow screens */
	@media (max-width: 40rem) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
