/**
 * A tool to generate Perlin Noise values (1, 2 and 3D).
 */
const PERLIN = {
    /**
     * Returns a one-dimensional noise value (number between -1 and 1).
     * @param {number} x A numeric expression.
     * @returns {number}
     */
    noise1D(x) {
        const MFX = Math.floor(x);
        const X = MFX & 255;
        x = x - MFX;
        return (
            lerp(fade(x),
                grad1D(p[p[X]], x),
                grad1D(p[p[X + 1]], x - 1)));
    },

    /**
     * Returns a two-dimensional noise value (number between -1 and 1).
     * @param {number} x A numeric expression.
     * @param {number} y A numeric expression.
     * @returns {number}
     */
    noise2D(x, y) {
        const MFX = Math.floor(x);
        const MFY = Math.floor(y);
        const X = MFX & 255;
        const Y = MFY & 255;
        x = x - MFX;
        y = y - MFY;
        const A = p[X] + Y;
        const B = p[X + 1] + Y;
        const FX = fade(x);
        return (
            lerp(
                fade(y),
                lerp(
                    FX,
                    grad2D(p[A], x, y),
                    grad2D(p[B], x - 1, y)),
                lerp(
                    FX,
                    grad2D(p[A + 1], x, y - 1),
                    grad2D(p[B + 1], x - 1, y - 1))));
    },

    /**
     * Returns a three-dimensional noise value (number between -1 and 1).
     * @param {number} x A numeric expression.
     * @param {number} y A numeric expression.
     * @param {number} z A numeric expression.
     * @returns {number}
     */
    noise3D(x, y, z) {
        const MFX = Math.floor(x);
        const MFY = Math.floor(y);
        const MFZ = Math.floor(z);
        const X = MFX & 255;
        const Y = MFY & 255;
        const Z = MFZ & 255;
        x = x - MFX;
        y = y - MFY;
        z = z - MFZ;
        const A = p[X] + Y;
        const AA = p[A] + Z;
        const AB = p[A + 1] + Z;
        const B = p[X + 1] + Y;
        const BA = p[B] + Z;
        const BB = p[B + 1] + Z;
        const FX = fade(x);
        const FY = fade(y);
        return (
            lerp(
                fade(z),
                lerp(
                    FY,
                    lerp(
                        FX,
                        grad3D(p[AA], x, y, z),
                        grad3D(p[BA], x - 1, y, z)),
                    lerp(
                        FX,
                        grad3D(p[AB], x, y - 1, z),
                        grad3D(p[BB], x - 1, y - 1, z))),
                lerp(
                    FY,
                    lerp(
                        FX,
                        grad3D(p[AA + 1], x, y, z - 1),
                        grad3D(p[BA + 1], x - 1, y, z - 1)),
                    lerp(
                        FX,
                        grad3D(p[AB + 1], x, y - 1, z - 1),
                        grad3D(p[BB + 1], x - 1, y - 1, z - 1)))));
    }
};

/**
* Utils
*/
const perm = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233,
    7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
    247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57,
    177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74,
    165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60,
    211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65,
    25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
    135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217,
    226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
    59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248,
    152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39,
    253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97,
    228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145,
    235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204,
    176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67,
    29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
];
var p = new Array(512);
for (let i = 0; i < 256; i++) p[256 + i] = p[i] = perm[i];

/**
* Internal usage.
*/
function grad1D(hash, x) {
    const h = hash & 1;
    return (h == 0 ? x : -x);
}

/**
* Internal usage.
*/
function grad2D(hash, x, y) {
    const h = hash & 3;
    return (h < 2 ? x : -x) + (h == 0 || h == 2 ? y : -y);
}

/**
* Internal usage.
*/
function grad3D(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y,
        v = h < 4 ? y : h == 12 || h == 14 ? x : z;
    return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
}

/**
* Internal usage.
*/
function fade(t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

/**
* Internal usage.
*/
function lerp(t, a, b) {
    return a + t * (b - a);
}

export default PERLIN;