<script lang="ts">
	// Ticks: with the defaults it draws 16 ticks, 0, 2, 4, … 30. The + steps / 2 in d3.range
	// is there because D3’s range excludes its stop value, so the last tick (30) would otherwise be dropped.
	// Props: min_scale, max_scale, and steps are all props, with defaults 0, 30, and 2.
	// If steps is 0 or negative, or max_scale is not greater than min_scale, no ticks are drawn.
	// Rounding: toPrecision(12) keeps fractional steps clean, for example 0.30000000000000004 prints as 0.3.
	// SVG height: it is now height + axisHeight, so the axis sits inside the SVG instead of relying on overflow: visible.
	// Axis color: it uses currentColor, so it follows the surrounding text color.
	//Step size: if steps doesn’t divide the range evenly, the last tick stops short of max_scale.

	// @ts-expect-error d3 declarations are not installed in this project.
	import * as d3 from 'd3';

	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let {
		width = 500,
		height = 70,
		color = 'white',
		borderRadius = 0,
		min_scale = 0,
		max_scale = 50,
		steps = 2,
		x_pos = 12.5,
		line_color = 'white',
		line_width = 2
	}: {
		width?: number;
		height?: number;
		color?: string;
		borderRadius?: number;
		min_scale?: number;
		max_scale?: number;
		steps?: number;
		x_pos?: number;
		line_color?: string;
		line_width?: number;
	} = $props();

	const axisHeight = 30; // room below the rectangle for tick marks and labels
	const tickSize = 6;

	// Declarative D3 utilities: Using d3-color to compute a darker border shade automatically
	let baseColor = $derived(
		(
			d3 as unknown as {
				color: (value: string) => { darker: (amount?: number) => { toString(): string } } | null;
			}
		).color(color)
	);
	let strokeColor = $derived(baseColor ? baseColor.darker(0.5).toString() : '#1e40af');

	// Svelte renders the axis as markup; scale and tick values are computed locally.
	let xScale: (value: number) => number = $derived((value: number) => {
		const domainWidth = max_scale - min_scale;
		return domainWidth === 0 ? width / 2 : ((value - min_scale) / domainWidth) * width;
	});

	// min_scale, min_scale + steps, ... up to max_scale (inclusive when it lands on a step)
	let ticks: number[] = $derived(
		steps > 0 && max_scale > min_scale && Number.isFinite(steps)
			? Array.from(
					{ length: Math.ceil((max_scale - min_scale) / steps + 0.5) },
					(_, index) => +(min_scale + index * steps).toPrecision(12)
				)
			: []
	);

	// Pixel position of the vertical line, and whether it falls inside the scale
	// let lineX = $derived(xScale(x_pos));
	// let lineVisible = $derived(x_pos >= min_scale && x_pos <= max_scale);

	let defaultToxicLine = $derived(xScale(12.5));

	// -------------------- //

	// Smoothly animate the line. The tween runs in scale units (not pixels), so resizing the
	// component or changing min_scale / max_scale repositions the line at once instead of
	// animating, and only a change to x_pos animates.

	// svelte-ignore state_referenced_locally

	// How it works: new Tween(x_pos, …) starts the line at the initial x_pos, so it doesn’t animate in from 0 on mount. The $effect runs whenever the prop changes and sets tPos.target, and tPos.current animates toward it over 750 ms. This avoids Tween.of, which gave you trouble earlier.
	// Warning comment: the svelte-ignore comment silences Svelte’s “only captures the initial value” warning, which is intended here because the initial value is what we want. The effect handles every later change.
	// NaN guard: the Number.isFinite check means a non-numeric x_pos is ignored and the line stays where it is. This avoids the “Cannot interpolate values of different type” error you hit before.
	// Visibility: lineVisible now follows the animated value, so a line moving out of range slides to the edge and disappears there. If you’d rather it vanish as soon as the target is out of range, use x_pos in that check instead of tPos.current.
	// Static line: the white dashed 12.5 line doesn’t animate. Its position changes immediately if width or the scale changes.
	// Changing the animation: the duration and easing options are the only things to edit.

	const tPos = new Tween(x_pos, { duration: 750, easing: cubicOut });

	$effect(() => {
		if (Number.isFinite(x_pos)) tPos.target = x_pos;
	});

	// Pixel position of the vertical line, and whether it is currently inside the scale
	let lineX = $derived(xScale(tPos.current));
	let lineVisible = $derived(tPos.current >= min_scale && tPos.current <= max_scale);
</script>

<svg
	{width}
	height={height + axisHeight}
	role="img"
	aria-label="Rectangle with a horizontal axis from {min_scale} to {max_scale} and a vertical line at {x_pos}"
>
	<rect
		{width}
		{height}
		fill={color}
		stroke={strokeColor}
		stroke-width="2"
		rx={borderRadius}
		ry={borderRadius}
	/>

	<text class="wq-props" x={lineX} y={-8} font-size={16} fill="white" text-anchor="middle">
		{x_pos.toFixed(1)} µg/L
	</text>

	<!-- 12.5-µg/L line -->
	<!-- <line
		x1={defaultToxicLine}
		x2={defaultToxicLine}
		y1={height}
		y2="0"
		stroke="white"
		stroke-width={line_width}
		stroke-dasharray="5 5"
		stroke-opacity="0.75"
	/> -->

	<!-- Vertical line from the base of the rectangle up to its top, at x_pos on the scale -->
	{#if lineVisible}
		<line x1={lineX} x2={lineX} y1={height} y2="0" stroke={line_color} stroke-width={line_width} />
	{/if}

	<!-- Axis along the bottom edge of the rectangle -->
	<g class="axis" transform="translate(0, {height})" text-anchor="middle">
		<line x1="0" x2={width} stroke="currentColor" />
		{#each ticks as tick (tick)}
			<g transform="translate({xScale(tick)}, 0)">
				<line y2={tickSize} stroke="currentColor" />
				<text y={tickSize + 4} dy="0.71em" fill="currentColor">{tick}</text>
			</g>
		{/each}
	</g>
</svg>

<style>
	svg {
		display: inline-block;
		overflow: visible;
	}
	.axis text {
		font-size: 11px;
	}
</style>
