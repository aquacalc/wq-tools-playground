<script lang="ts">
	let {
		temp = 28,
		sal = 34.5,
		ph = 7.5,
		tan = 0.15,
		critPh = 7,
		uian
	}: {
		temp?: number;
		sal?: number;
		ph?: number;
		tan?: number;
		critPh?: number;
		uian?: number;
	} = $props();
</script>

<div class="mx-80 my-8 w-[500] rounded border border-yellow-400 p-8">
	<h1>Summary</h1>

	<p>
		Most commercial test kits (API, Hach, Nessler) report Total Ammonia Nitrogen (TAN), not
		unionized ammonia. You must use pH and temperature to calculate the toxic NH₃ fraction.
		Reporting TAN alone without calculating NH₃ can be misleading.
	</p>

	<div class="flex w-full text-center">
		<img src="/nh3_to_nh4+.png" class="mx-auto w-60 max-w-full" alt="" />
	</div>

	<div style="text-align: center; margin-top: 20px;">
		<!-- <h2>VID VALUE: {value}</h2> -->
		<video width="650" height="400px" controls controlsList="nodownload" poster="manim-poster.png">
			<source src="/MembraneDiffusionEq6.mp4" type="video/mp4" />
			<track kind="captions" src="" srclang="en" label="English captions" />
			Your browser does not support the video tag.
		</video>
	</div>

	<h1>{temp.toFixed(1)}º C</h1>
	<h1>{sal.toFixed(1)}‰</h1>
	<h1>{ph.toFixed(2)} (NBS Scale)</h1>
	<h1>{tan.toFixed(2)} mg/L</h1>

	<h1 class="text-red-500">{critPh.toFixed(2)}</h1>
	<h2>{uian?.toFixed(2)} µg/L</h2>

	<h1 class="text-xl text-blue-200">
		{uian !== undefined ? ((100 * uian) / (tan * 1000)).toFixed(2) : ''}%
	</h1>
</div>
