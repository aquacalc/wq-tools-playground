<script lang="ts">
	import TextInput from './TextInput.svelte';
	import Slider from './Slider.svelte';

	let {
		label = 'Label',
		min_scale = 0,
		max_scale = 40,
		step = 0.1,
		id = 'dummy-id',
		options = [],
		store
	}: {
		label: string;
		// width?: number;
		// height?: number;
		// color?: string;
		// borderRadius?: number;
		min_scale?: number;
		max_scale?: number;
		step?: number;
		id: string;
		options?: string[];
		store: { value: number; set: (value: number) => void };
		// store: { value: { current: number }; set: (value: number) => void };
		// x_pos?: number;
		// line_color?: string;
		// line_width?: number;
	} = $props();
</script>

<section class="cell">
	<header class="cell-top font-bold">{label}</header>
	<div class="cell-left"><TextInput {id} {min_scale} {max_scale} {step} {store} /></div>
	<div class="cell-right"><Slider {id} {min_scale} {max_scale} {step} {options} {store} /></div>
</section>

<style>
	/* Outer layout: two columns; four cells wrap into two rows */
	/* .grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	} */

	/* Each cell: top row spans the cell, bottom row is 1fr + 2fr */
	.cell {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
		gap: 0.5rem;
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		align-items: center;
        background-color: #2f3c79;
	}

	.cell-top {
		grid-column: 1 / -1; /* spans both columns */
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
