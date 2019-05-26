import Vector from './Vector.js';
import { M } from '../loops/ff_a_loop.js';

/**
 * Flow Field Dot, an object, particle-like specially made to work with
 * perlin noise flow field and be affected by it.
 */
class FFDot {
    /**
     * Creates a Flow Field Dot.
     * @param {Vector} position The initial position.
     * @param {String} edge The edge behavior ('replace' | 'infinite' | 
     * 'bounce').
     * @param {Vector} boundary The movement limits 
     * (width & height).
     * @param {Vector} target The FF that will affect the dot.
     * @param {Array} origin The array that holds 'this'.
     * @param {number} gridSize The size of the FF grid.
     * @param {number} mass The mass of the dot.
     * @param {number} maxSpeed Max speed of the dot.
     */
    constructor(position, edge, boundary, target, origin, gridSize, mass,
        maxSpeed) {
        this.pos = position;
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        this.prevPos = new Vector(0, 0);
        this.edge = edge;
        this.boundary = boundary;
        this.target = target;
        this.origin = origin;
        this.gridSize = gridSize;
        if (mass) this.mass = mass;
        else this.mass = .04;
        if (maxSpeed) this.maxSpeed = maxSpeed;
        else this.maxSpeed = 1.1;
    }
    update() {
        this.prevPos.copy(this.pos);
        const X = Math.floor(this.pos.x / this.gridSize);
        const Y = Math.floor(this.pos.y / this.gridSize);
        const F = this.target[Y * (this.boundary.x / this.gridSize) + X];
        this.acc.add(F);
        this.acc.normalize();
        this.acc.multiply(this.mass);
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        if (this.edge === 'replace') {
            if (this.pos.x >= this.boundary.x - M ||
                this.pos.y >= this.boundary.y - M ||
                this.pos.x <= M ||
                this.pos.y <= M) {
                this.pos.x = M + (Math.random() * (this.boundary.x - M));
                this.pos.y = M + (Math.random() * (this.boundary.y - M));
                this.prevPos.copy(this.pos);
                this.vel.multiply(0);
            }
        } else if (this.edge === 'infinite') {
            if (this.pos.x >= this.boundary.x - M) {
                this.pos.x = M;
                this.prevPos.x = M;
            } else {
                if (this.pos.x <= M) {
                    this.pos.x = this.boundary.x - (M);
                    this.prevPos.x = this.boundary.x - (M);
                }
            }
            if (this.pos.y >= this.boundary.y - M) {
                this.pos.y = M;
                this.prevPos.y = M;
            } else {
                if (this.pos.y <= M) {
                    this.pos.y = this.boundary.y - (M);
                    this.prevPos.y = this.boundary.y - (M);
                }
            }
        } else if (this.edge === 'bounce') {
            if (this.pos.x >= this.boundary.x - M) {
                this.pos.x = this.boundary.x - M;
                this.vel.x = -this.vel.x;
            } else {
                if (this.pos.x <= M) {
                    this.pos.x = M;
                    this.vel.x = -this.vel.x;
                }
            }
            if (this.pos.y >= this.boundary.y - M) {
                this.pos.y = this.boundary.y - M;
                this.vel.y = -this.vel.y;
            } else {
                if (this.pos.y <= M) {
                    this.pos.y = M;
                    this.vel.y = -this.vel.y;
                }
            }
        }
        this.acc.multiply(0);
    }
}

export default FFDot;