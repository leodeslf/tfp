import Vector from "./Vector.js";

/**
 * A tool to generate Worley Noise values.
 */
const WORLEY = {
	/**
	 * Returns a two-dimensional value based on the first closest point
	 * euclidian distance.
	 * Using a single random color per 'area'.
	 * @param {Spots[]} spots An array of points.
	 * @param {Vector} pos A Vector pointing to the current X and Y.
	 * @returns {number}
	 */
	st(spots, pos) {
		let minDist = Infinity, minPoint = undefined;
		for (let i = 0; i < spots.length; i++) {
			let dist = Vector.distanceEuclidian(pos, spots[i].pos);
			if (dist < minDist) {
				minDist = dist;
				minPoint = spots[i];
			}
		}
		return { minDist, minPoint };
	},

	/**
	 * Returns a two-dimensional value based on the second closest point
	 * euclidian distance.
	 * @param {Spots[]} spots An array of points.
	 * @param {Vector} pos A Vector pointing to the current X and Y.
	 * @returns {number}
	 */
	nd(spots, pos) {
		let minDist = Infinity, minPoint = undefined;
		let nMin = [minDist - 1, minDist];
		for (let i = 0; i < spots.length; i++) {
			let dist = Vector.distanceEuclidian(pos, spots[i].pos);
			if (dist < nMin[0]) {
				nMin[1] = nMin[0];
				nMin[0] = dist;
				minPoint = spots[i];
			} else if (dist < nMin[1]) {
				nMin[1] = dist;
				minPoint = spots[i];
			}
		}
		minDist = nMin[1];
		return { minDist, minPoint };
	},

	/**
	 * Returns a two-dimensional value based on the second minus fist
	 * closest point euclidian distance.
	 * @param {Spots[]} spots An array of points.
	 * @param {Vector} pos A Vector pointing to the current X and Y.
	 * @returns {number}
	 */
	ndMinusSt(spots, pos) {
		let minDist = Infinity, minPoint = undefined;
		let nMin = [minDist - 1, minDist];
		for (let i = 0; i < spots.length; i++) {
			let dist = Vector.distanceEuclidian(pos, spots[i].pos);
			if (dist < nMin[0]) {
				nMin[1] = nMin[0];
				nMin[0] = dist;
				minPoint = spots[i];
			} else if (dist < nMin[1]) {
				nMin[1] = dist;
				minPoint = spots[i];
			}
		}
		minDist = nMin[1] - nMin[0];
		return { minDist, minPoint };
	},

	/**
	 * Returns a two-dimensional value based on the first closest point
	 * using manhattan metrics.
	 * @param {Spots[]} spots An array of points.
	 * @param {Vector} pos A Vector pointing to the current X and Y.
	 * @returns {number}
	 */
	manhattan(spots, pos) {
		let minDist = Infinity, minPoint = undefined;
		for (let i = 0; i < spots.length; i++) {
			let dist = Vector.distanceManhattan(pos, spots[i].pos);
			if (dist < minDist) {
				minDist = dist;
				minPoint = spots[i];
			}
		}
		return { minDist, minPoint };
	},

	/**
	 * Returns a two-dimensional value based on the first closest point
	 * using chebyshev metrics (manhattan-like rotated 45 degrees).
	 * @param {Spots[]} spots An array of points.
	 * @param {Vector} pos A Vector pointing to the current X and Y.
	 * @returns {number}
	 */
	chebyshev(spots, pos) {
		let minDist = Infinity, minPoint = undefined;
		for (let i = 0; i < spots.length; i++) {
			let dist = Vector.distanceChebyshev(pos, spots[i].pos);
			if (dist < minDist) {
				minDist = dist;
				minPoint = spots[i];
			}
		}
		return { minDist, minPoint };
	},

	/**
	 * Returns a two-dimensional value based on the first closest point
	 * using minkowski metrics. 
	 * @param {Spots[]} spots An array of points.
	 * @param {Vector} pos A Vector pointing to the current X and Y.
	 * @returns {number}
	 */
	minkowski(spots, pos) {
		let minDist = Infinity, minPoint = undefined;
		for (let i = 0; i < spots.length; i++) {
			let e = 3;
			let dist = Vector.distanceMinkowski(pos, spots[i].pos, e);
			if (dist < minDist) {
				minDist = dist;
				minPoint = spots[i];
			}
		}
		return { minDist, minPoint };
	}
};

export default WORLEY;