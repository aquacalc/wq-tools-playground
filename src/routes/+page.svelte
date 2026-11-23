<script lang="ts">
	import { tanStore } from '#lib/stores/TanStore.svelte.js';
	import { tempStore } from '#lib/stores/TempStore.svelte.js';
	import { phStore } from '#lib/stores/PhStore.svelte.js';
	import { salStore } from '#lib/stores/SalStore.svelte.js';

	import Rect from '#lib/uian/Rect.svelte';
	import SliderText from '#lib/SliderText.svelte';

	let uianThreshhold = $state(12.5);
</script>

<div class="mb-4 mt-6 flex flex-col items-center text-2xl text-white-700">
	<h1>Un-ionized Ammonia (µg/L)</h1>
</div>

<section class="flex flex-col items-center">
	<Rect x_pos={uianThreshhold} />

	<label class="range-input-label w-[500px]" for="uian" style="text-align: left">
		<input
			id="uian"
			type="range"
			class="w-full cursor-pointer"
			//oninput={(e) => tempAndSal.tempC.set(+e.target.value)}
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

	<hr />

	<div class="grid mt-6">
		<SliderText
			label="TA-N"
			id="tan"
			store={tanStore}
			max_scale={3}
			step={0.01}
			options={['0.5', '1', '1.5', '2.5']}
		/>
		<SliderText
			label="pH"
			id="ph"
			store={phStore}
			min_scale={6}
			max_scale={9}
			step={0.01}
			options={['6.5', '7', '7.5', '8']}
		/>
		<SliderText
			label="Temperature"
			id="temp"
			store={tempStore}
			min_scale={15}
			max_scale={40}
			options={['20', '25', '30', '35']}
		/>
		<SliderText
			label="Salinity"
			id="sal"
			store={salStore}
			min_scale={0}
			max_scale={40}
			options={['10', '15', '25', '30']}
		/>
	</div>
</section>

<style>
	/* Outer layout: two columns; four cells wrap into two rows */
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}

	/* Each cell: top row spans the cell, bottom row is 1fr + 2fr */
	/* .cell {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
		gap: 0.5rem;
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
	} */

	/* spans both columns */
	/* .cell-top {
		grid-column: 1 / -1;
	} */

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
