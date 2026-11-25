<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let {
		min_scale = 0,
		max_scale = 40,
		step = 0.1,
		id = 'dummy-id',
		options = [],
		store
	}: {
		min_scale?: number;
		max_scale?: number;
		step?: number;
		id: string;
		options: string[];
		store: { value: number; set: (value: number) => void };
	} = $props();

	// Tween the value smoothly whenever store.value changes
	const tweenedValue = Tween.of(() => store.value, {
		duration: 350,
		easing: cubicOut
	});
</script>

<label class="range-input-label w-full" for={`${id}-slider`} style="text-align: left">
	<input
		id={`${id}-slider`}
		type="range"
		class="mx-8 w-60 cursor-pointer"
		value={tweenedValue.current}
		oninput={(e) => store.set(+e.currentTarget.value)}
		min={min_scale}
		max={max_scale}
		{step}
		list={`${id}-markers`}
	/>

	<datalist id={`${id}-markers`} class="mx-8 w-60">
		{#each options as opt (opt)}
			<option value={+opt} label={opt}></option>
		{/each}
	</datalist>
</label>

