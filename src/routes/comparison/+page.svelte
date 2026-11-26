<script lang="ts">
	import { calculateUnionizedAmmonia } from '#lib/nh3-calcs/ammonia-models.ts';

	import { getKNH4, critPhFreeForTanMillero, percentNh3ForTemp, phNbsToPhFree } from '#lib/wq-brains/CarbCalcFunctions.js';

	// Reactive inputs using Svelte 5 runes
	let tan = $state(1.0); // mg/L TAN
	let ph = $state(7.0); // pH
	let tempC = $state(30.0); // °C
	let salinity = $state(30.0); // ppt
	let selectedModel = $state<'bower-bidwell' | 'clegg-whitfield'>('bower-bidwell');

	// Reactive calculation derived automatically when inputs change
	let results = $derived(calculateUnionizedAmmonia(tan, ph, tempC, salinity, selectedModel));
</script>

<div class="mx-auto max-w-lg space-y-4 rounded-xl bg-white p-6 shadow-md">
	<h2 class="text-xl font-bold text-slate-800">Ammonia Equilibrium Calculator</h2>

	<div class="grid grid-cols-2 gap-4 text-slate-950">
		<label class="block">
			<span class="text-sm font-medium text-slate-600">TAN (mg/L)</span>
			<input
				type="number"
				step="0.1"
				bind:value={tan}
				class="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm"
			/>
		</label>
		<label class="block">
			<span class="text-sm font-medium text-slate-600">pH</span>
			<input
				type="number"
				step="0.1"
				bind:value={ph}
				class="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm"
			/>
		</label>
		<label class="block">
			<span class="text-sm font-medium text-slate-600">Temperature (°C)</span>
			<input
				type="number"
				step="0.5"
				bind:value={tempC}
				class="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm"
			/>
		</label>
		<label class="block">
			<span class="text-sm font-medium text-slate-600">Salinity (ppt)</span>
			<input
				type="number"
				step="1"
				bind:value={salinity}
				class="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm"
			/>
		</label>
	</div>

	<label class="block">
		<span class="text-sm font-medium text-slate-600">Calculation Model</span>
		<select
			bind:value={selectedModel}
			class="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm text-slate-700"
		>
			<option value="bower-bidwell">Bower & Bidwell (1978)</option>
			<option value="clegg-whitfield">Clegg & Whitfield (1995)</option>
		</select>
	</label>

	<div class="mt-6 space-y-2 rounded-lg border border-slate-800 bg-slate-50 text-slate-600 p-4">
		<div class="flex justify-between">
			<span class="text-slate-600">Calculated pKa:</span>
			<span class="font-semibold">{results.pka.toFixed(4)}</span>
		</div>
		<div class="flex justify-between">
			<span class="text-slate-600">Un-ionized Fraction (%):</span>
			<span class="font-bold text-blue-600">{results.percentage.toFixed(3)}%</span>
		</div>
		<div class="flex justify-between">
			<span class="text-slate-600">NH3-N Concentration:</span>
			<span class="font-semibold">{1000 * +results.unionizedN.toFixed(5)} µg/L</span>
		</div>
		<div class="flex justify-between">
			<span class="text-slate-600">Whole NH3 Molecule:</span>
			<span class="font-semibold">{results.unionizedWhole.toFixed(5)} mg/L</span>
		</div>
		<hr />
		<div class="flex justify-between">
			<span class="text-slate-600">my pKa</span>
			<span class="font-semibold">{-Math.log10(getKNH4(tempC + 273.15, salinity, 0)).toFixed(4)} mol/kg-soln</span>
		</div>
		<div class="flex justify-between">
			<span class="text-slate-600">my pH</span>
			<span class="font-semibold">{percentNh3ForTemp(tempC + 273.15, salinity, phNbsToPhFree(ph, salinity, tempC + 273.13, 0)).toFixed(3)}%</span>
		</div>
	</div>
</div>

