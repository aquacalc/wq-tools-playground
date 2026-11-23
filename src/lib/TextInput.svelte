<script lang="ts">
	let {
		id = 'dummy-id',
		min_scale = 0,
		max_scale = 10,
		step = 0.1,
		store
	}: {
		id: string;
		min_scale?: number;
		max_scale?: number;
		step?: number;
		store: { value: number; set: (value: number) => void };
		// store: { value: { current: number }; set: (value: number) => void };
	} = $props();
</script>

<input
	type="number"
	name={`${id}`}
	id={`${id}`}
	value={store.value}
	oninput={(e) => store.set(+e.currentTarget.value)}
	min={min_scale}
	max={max_scale}
	{step}
/>

<style>
	input {
		border: 1px solid whitesmoke;
        background-color: #21337f;
		font: inherit;
		font-family: sans-serif;
		font-size: 1.2rem;
		text-align: right;
		border-radius: 8px;
		padding: 4px;
		width: 5rem;
	}
</style>
