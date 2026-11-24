<script lang="ts">
	let {
		temp = 28,
		sal = 34.5,
		ph = 7.5,
		tan = 0.15
	}: {
		temp?: number;
		sal?: number;
		ph?: number;
		tan?: number;
	} = $props();
</script>

<div class="mx-80 my-8 w-[500] rounded border border-yellow-400 p-8">
	<h1>Summary</h1>

	<p>
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam facilis illo commodi
		voluptas qui tempore a hic ipsam consequuntur deleniti, nemo praesentium nulla atque, rerum
		obcaecati iste et nesciunt eos.
	</p>

	<h1>{temp.toFixed(1)}º C</h1>
	<h1>{sal.toFixed(1)}‰</h1>
	<h1>{ph.toFixed(2)} (NBS Scale)</h1>
	<h1>{tan.toFixed(2)} mg/L</h1>
</div>
