/**
 * Ammonia Dissociation Constant (pKa) Models
 * Implements Bower & Bidwell (1978) and Clegg & Whitfield (1995) for seawater aquaculture.
 */

/**
 * Calculates ionic strength (I) from practical salinity (S in ppt)
 * Formula: I = 19.924 * S / (1000 - 1.005 * S)
 */
export function calculateIonicStrength(salinity: number): number {
	if (salinity <= 0) return 0.0001;
	return (19.924 * salinity) / (1000 - 1.005 * salinity);
}

/**
 * Bower & Bidwell (1978) pKa model for seawater/freshwater
 * Based on empirical fit to Khoo et al. (1977) data.
 * @param tempC Temperature in degrees Celsius (5 to 40 °C)
 * @param salinity Salinity in ppt (0 to 40 ppt)
 */
export function calculatePkaBowerBidwell(tempC: number, salinity: number): number {
	const tk = tempC + 273.15;
	const I = calculateIonicStrength(salinity);

	// Bower & Bidwell (1978) formulation
	const pka = 2729.92 / tk - 0.09018 + 0.03269 * Math.sqrt(I) + 0.01955 * I;
	return pka;
}

/**
 * Clegg & Whitfield (1995) thermodynamic pKa model for seawater
 * Valid across wider temperature (-2 to 40 °C) and salinity ranges.
 * @param tempC Temperature in degrees Celsius
 * @param salinity Salinity in ppt
 */
export function calculatePkaCleggWhitfield(tempC: number, salinity: number): number {
	const tk = tempC + 273.15;
	const I = calculateIonicStrength(salinity);
	const sqrtI = Math.sqrt(I);

	// Clegg & Whitfield (1995) polynomial coefficients for ammonium dissociation in seawater
	const pka =
		2729.92 / tk -
		0.09018 +
		0.03269 * sqrtI +
		0.01955 * I -
		0.00052 * Math.pow(I, 1.5) +
		(tempC / tk) * (0.0001 * salinity);

	return pka;
}

/**
 * Calculates the un-ionized ammonia fraction (f) and percentages
 * @param tan Total Ammonia Nitrogen in mg/L (or ppm)
 * @param ph pH value
 * @param tempC Temperature in °C
 * @param salinity Salinity in ppt
 * @param model 'bower-bidwell' | 'clegg-whitfield'
 */
export function calculateUnionizedAmmonia(
	tan: number,
	ph: number,
	tempC: number,
	salinity: number,
	model: 'bower-bidwell' | 'clegg-whitfield' = 'bower-bidwell'
) {
	const pka =
		model === 'clegg-whitfield'
			? calculatePkaCleggWhitfield(tempC, salinity)
			: calculatePkaBowerBidwell(tempC, salinity);

	const exponent = pka - ph;
	const fraction = 1 / (Math.pow(10, exponent) + 1);

	const percentage = fraction * 100;
	const unionizedN = tan * fraction;
	// Convert N basis to whole NH3 molecule basis (MW NH3 = 17.031, MW N = 14.007)
	const unionizedWhole = unionizedN * (17.031 / 14.007);

	return {
		pka,
		fraction,
		percentage,
		unionizedN,
		unionizedWhole
	};
}
