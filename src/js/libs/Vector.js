/**
 * A two-dimensional vector class.
 */
class Vector {
    /**
     * Creates a two-dimensional vector pointing to X and Y.
     * @param {number} x Numeric expression.
     * @param {number} y Numeric expression.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    ////////////////////
    // STATIC METHODS //
    ////////////////////

    /**
     * Returns a Vector equals to A plus B.
     * @param {Vector} a Vector.
     * @param {number | Vector} b A numeric expression or a Vector.
     */
    static add(a, b) {
        return b instanceof Vector ?
            new Vector(a.x + b.x, a.y + b.y) :
            new Vector(a.x + b, a.y + b);
    }

    /**
     * Creates a Vector using Polar Coordinates (radius and angle).
     * @param {number} radius Numeric expression.
     * @param {number} angle Numeric expression (angle measured in radians).
     */
    static byPolarCoords(radius, angle) {
        return new Vector(
            radius * Math.cos(angle),
            radius * Math.sin(angle)
        );
    }

    /**
     * Returns the Chebyshev Distance.
     * 
     * - "Also known as the Chessboard Distance, it is somewhat similar
     * to the Manhattan distance, but with 45 degrees rotation."
     * @param {Vector} a A Vector.
     * @param {Vector} b A Vector.
     */
    static distanceChebyshev(a, b) {
        return Math.max(
            Math.abs(a.x - b.x),
            Math.abs(a.y - b.y)
        );
    }

    /**
     * Returns the Euclidian Distance of A to B.
     * @param {Vector} a A Vector.
     * @param {Vector} b A Vector.
     */
    static distanceEuclidian(a, b) {
        const S = (a.x - b.x);
        const T = (a.y - b.y);
        return Math.sqrt((S * S) + (T * T));
    }

    /**
     * Returns the Manhattan Distance.
     * 
     * - "Inspired by the grid-like organization of Manhattan, this
     * is distance to the nearest points when you can only travel
     * around the boundaries."
     * 
     * - In other words: 
     * Only horizontal, vertical and diagonal (45 deg.) movements.
     * @param {Vector} a A Vector.
     * @param {Vector} b A Vector.
     */
    static distanceManhattan(a, b) {
        return Math.sqrt(
            Math.abs(a.x - b.x) +
            Math.abs(a.y - b.y)
        );
    }

	/**
	 * Returns the Minkowski Distance.
     * 
     * - It takes an exponent parameter (e), and the results can be similar
     * or even equivalent to Chebyshev, Eclidian and Manhattan.
     * 
     * - If { p = 1 }: It'll be equivalent to Manhattan distance.
     * 
     * - If { p = 2 }: It'll be equivalent to Euclidian distance.
     * 
     * - If { p = infinite }: It'll be equivalent to Chebyshev distance.
	 *
	 * @param {Vector} a A Vector.
	 * @param {Vector} b A Vector.
     * @param {Vector} e A numeric expression.
	 */
    static distanceMinkowski(a, b, e) {
        return (
            (
                Math.abs(a.x - b.x) ** e +
                Math.abs(a.y - b.y) ** e
            ) ** (1 / e)
        );
    }

    /**
     * Returns the division of A by B.
     * @param {Vector} a A Vector.
     * @param {number | Vector} b A numeric expression or a Vector.
     */
    static divide(a, b) {
        return b instanceof Vector ?
            new Vector(a.x / b.x, a.y / b.y) :
            new Vector(a.x / b, a.y / b);
    }

    /**
     * Returns the product of A by B.
     * @param {Vector} a A Vector.
     * @param {number | Vector} b A numeric expression or a Vector
     */
    static multiply(a, b) {
        return b instanceof Vector ?
            new Vector(a.x * b.x, a.y * b.y) :
            new Vector(a.x * b, a.y * b);
    }

    /**
     * Returns a Vector equals to A minus B.
     * @param {Vector} a A Vector.
     * @param {number | Vector} b A numeric expression or a Vector.
     */
    static subtract(a, b) {
        return b instanceof Vector ?
            new Vector(a.x - b.x, a.y - b.y) :
            new Vector(a.x - b, a.y - b);
    }

    //////////////////////
    // INSTANCE METHODS //
    //////////////////////

    /**
     * Adds A to 'this' Vector.
     * @param {number | Vector} a A numeric expression or a Vector.
     */
    add(a) {
        if (a instanceof Vector) {
            this.x = this.x + a.x;
            this.y = this.y + a.y;
        } else {
            this.x = this.x + a;
            this.y = this.y + a;
        }
    }

    /**
     * Copy the coordinates of A to 'this' Vector.
     * @param {Vector} a A Vector.
     */
    copy(a) {
        this.x = a.x;
        this.y = a.y;
    }

    /**
     * Divides 'this' Vector by A.
     * @param {number | Vector} a A numeric expression or a Vector.
     */
    divide(a) {
        if (a instanceof Vector) {
            this.x = this.x / a.x;
            this.y = this.y / a.y;
        } else {
            this.x = this.x / a;
            this.y = this.y / a;
        }
    }

    /**
     * Returns the angle of 'this' Vector (in radians).
     * Values between PI and -PI.
     */
    getAngle() {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Returns the magnitude (size) of 'this' Vector (Pythagorean theorem).
     */
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Limits the maximum size of 'this' Vector to the A value.
     * @param {number} a A numeric expression.
     */
    limit(a) {
        if (this.getMagnitude() > a) {
            this.normalize();
            this.multiply(a);
        }
    }

    /**
     * Multiplies 'this' Vector by A.
     * @param {number | Vector} a A numeric expression or a Vector.
     */
    multiply(a) {
        if (a instanceof Vector) {
            this.x = this.x * a.x;
            this.y = this.y * a.y;
        } else {
            this.x = this.x * a;
            this.y = this.y * a;
        }
    }

    /**
     * Sets to 1 'this' Vector's magnitude (Unit Vector).
     */
    normalize() {
        const MA = this.getMagnitude();
        this.x = this.x / MA;
        this.y = this.y / MA;
    }

    /**
     * Sets to A 'this' Vector's magnitude.
     * @param {number | Vector} a A numeric expression or a Vector.
     */
    setMagnitude(a) {
        this.normalize();
        this.multiply(a);
    }

    /**
     * Subtracts A to 'this' Vector.
     * @param {number | Vector} a A numeric expression or a Vector.
     */
    subtract(a) {
        if (a instanceof Vector) {
            this.x = this.x - a.x;
            this.y = this.y - a.y;
        } else {
            this.x = this.x - a;
            this.y = this.y - a;
        }
    }
}

export default Vector;
