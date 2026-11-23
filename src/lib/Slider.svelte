<script lang="ts">

	let {
		min_scale = 0,
		max_scale = 40,
		step = 0.1,
		id = 'dummy-id',
		options = [],
		store
	}: {
		// width?: number;
		// height?: number;
		min_scale?: number;
		max_scale?: number;
		step?: number;
		id: string;
		options: string[];
        store: { value: number; set: (value: number) => void };
		// store: { value: { current: number }; set: (value: number) => void };
	} = $props();

	// let dummy = $state(22.2);
</script>

<!-- oninput={(e) => tanStore.set(Number(e.currentTarget.value))}
		bind:value={dummy} -->

<label class="range-input-label w-full" for={`${id}-slider`} style="text-align: left">
	<input
		id={`${id}-slider`}
		type="range"
		class="mx-8 w-60 cursor-pointer"
		value={store.value}
		oninput={(e) => store.set(+e.currentTarget.value)}
		min={min_scale}
		max={max_scale}
		{step}
		list={`${id}-markers`}
	/>

	<!-- <input type="number" class=" bg-amber-500" name="uian" id="uian" bind:value={uianThreshhold} /> -->

	<datalist id={`${id}-markers`} class="mx-8 w-60">
		{#each options as opt (opt)}
			<option value={+opt} label={opt}></option>
		{/each}
	</datalist>
</label>

<style>
	/* datalist {
		display: flex;
		justify-content: space-between;
		width: 100%;
		margin-top: 2px;
	} */

	/* option {
		display: inline-block;
		text-align: center; */
	/* Optional: style the tick line itself if supported */
	/* background-image: linear-gradient(to top, #ccc 2px, transparent 2px);
		background-size: 100% 10px;
		background-repeat: no-repeat;
		background-position: bottom center;
	} */
</style>
