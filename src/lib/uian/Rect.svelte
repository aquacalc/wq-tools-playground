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

	import { fade } from 'svelte/transition';

	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let {
		width = 500,
		height = 70,
		// color = 'white', // fallback / unused when gradient is active
		borderRadius = 0,
		min_scale = 0,
		max_scale = 50,
		steps = 5,
		x_pos = 12.5,
		line_color = 'yellow',
		line_width = 5,
		critUianPos = 12.5
	}: {
		width?: number;
		height?: number;
		// color?: string;
		borderRadius?: number;
		min_scale?: number;
		max_scale?: number;
		steps?: number;
		x_pos?: number;
		line_color?: string;
		line_width?: number;
		critUianPos: number;
	} = $props();

	const axisHeight = 30; // room below the rectangle for tick marks and labels
	const tickSize = 6;

	// Declarative D3 utilities: Using d3-color to compute a darker border shade automatically
	let baseColor = $derived(
		(
			d3 as unknown as {
				color: (value: string) => { darker: (amount?: number) => { toString(): string } } | null;
			}
		).color('#22c55e')
	);
	let strokeColor = $derived(baseColor ? baseColor.darker(0.5).toString() : '#15803d');

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

	const tPos = new Tween(0, { duration: 750, easing: cubicOut });

	$effect(() => {
		if (Number.isFinite(x_pos)) tPos.target = x_pos;
	});

	const tPosCrit = new Tween(12.5, { duration: 750, easing: cubicOut });

	$effect(() => {
		if (Number.isFinite(critUianPos)) tPosCrit.target = critUianPos;
	});

	// Pixel position of the vertical line, and whether it is currently inside the scale
	let lineX = $derived(xScale(tPos.current));
	let lineVisible = $derived(tPos.current >= min_scale && tPos.current <= max_scale);

	let lineXcrit = $derived(xScale(tPosCrit.current));
	let lineVisibleCrit = $derived(tPosCrit.current >= min_scale && tPosCrit.current <= max_scale);

	// Compute gradient stop percentages based on animated tPos.current
	// Creates a narrow yellow band (1% width total, ±0.5% around x_pos)
	let gradientStops = $derived.by(() => {
		const domainWidth = max_scale - min_scale;
		if (domainWidth === 0) return { yellowStart: '50%', yellowEnd: '50%' };

		const currentFraction = (tPos.current - min_scale) / domainWidth;
		const centerPercent = Math.max(0, Math.min(100, currentFraction * 100));

		const halfBandWidth = 0.5; // Narrower yellow band (1% total width)
		const yellowStart = Math.max(0, centerPercent - halfBandWidth);
		const yellowEnd = Math.min(100, centerPercent + halfBandWidth);

		return {
			yellowStart: `${yellowStart.toFixed(2)}%`,
			yellowEnd: `${yellowEnd.toFixed(2)}%`
		};
	});

	const gradientId = `linear-gradient-${Math.random().toString(36).substring(2, 9)}`;
</script>

<svg
	{width}
	height={height + axisHeight}
	role="img"
	aria-label="Rectangle with a horizontal axis from {min_scale} to {max_scale} and a vertical line at {x_pos}"
>
	<defs>
		<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
			<!-- Deep green to light green -->
			<stop offset="0%" stop-color="#14532d" />
			<stop offset={gradientStops.yellowStart} stop-color="#86efac" />

			<!-- Narrow yellow band -->
			<stop offset={gradientStops.yellowStart} stop-color="#eab308" />
			<stop offset={gradientStops.yellowEnd} stop-color="#eab308" />

			<!-- Light red to deep red -->
			<stop offset={gradientStops.yellowEnd} stop-color="#fca5a5" />
			<stop offset="100%" stop-color="#7f1d1d" />
		</linearGradient>
	</defs>

	<rect
		{width}
		{height}
		fill="url(#{gradientId})"
		stroke={strokeColor}
		stroke-width="1"
		rx={borderRadius}
		ry={borderRadius}
	/>

	<text
		class="wq-props"
		x={lineX}
		y={height * 1.55}
		font-size={16}
		fill="#FFED29"
		text-anchor="middle"
	>
		critical: {x_pos.toFixed(1)} µg/L
		<!-- <tspan fill="#FF2400">critical</tspan>: {x_pos.toFixed(1)} µg/L -->
	</text>

	{#if lineVisible}
		<line
			x1={lineX}
			x2={lineX}
			y1={height + 5}
			y2="0"
			stroke={line_color}
			stroke-width={line_width}
		/>
	{/if}

	<!-- If estimate UIA-N is NOT off the rectangle, then show it -->
	{#if lineVisibleCrit}
		<text class="wq-props" x={lineXcrit} y={-8} font-size={16} fill="white" text-anchor="middle">
			<!-- {x_pos.toFixed(1)} µg/L 👍 👎 -->
			<tspan fill="white">estimate</tspan>: {critUianPos.toFixed(1)} µg/L
		</text>

		<line
			x1={lineXcrit}
			x2={lineXcrit}
			y1={height}
			y2="-5"
			stroke="white"
			stroke-width={2}
			stroke-dasharray="5 5"
		/>
	{:else}
		<text in:fade={{ duration: 350 }}
			// class="wq-props"
			// x={xScale(115)}
			x={xScale(57.5)}
			y={height / 2}
			font-size={20}
			fill="red"
			text-anchor="middle"
		>
			<tspan fill="white">est</tspan>: {critUianPos.toFixed(1)} µg/L
		</text>
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
