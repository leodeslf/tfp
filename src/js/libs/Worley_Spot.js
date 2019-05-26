import Vector from "./Vector.js";
import { wp } from '../loops/worley_loop.js'

/**
 * Particle object to use with Worley methods.
 */
class Spot {
	constructor(x, y, maxVel) {
		this.pos = new Vector(x, y);
		this.vel = new Vector(Math.random() - 0.5, Math.random() - 0.5);
		this.acc = new Vector(0, 0);
		this.maxVel = maxVel;
		this.col = {
			r: Math.round(Math.random() * 255),
			g: Math.round(Math.random() * 255),
			b: Math.round(Math.random() * 255)
		};
	}
	edges() {
		// Bounce on walls
		if (this.pos.x < 0 || this.pos.x > wp.width) {
			if (this.pos.x < 0) this.pos.x = 0;
			else this.pos.x = wp.width;
			this.vel.x = -this.vel.x;
		}
		if (this.pos.y < 0 || this.pos.y > wp.height) {
			if (this.pos.y < 0) this.pos.y = 0;
			else this.pos.y = wp.height;
			this.vel.y = -this.vel.y;
		}
	}
	repulsion() {
		let min = Infinity;
		let min_point_pos = new Vector(0, 0);
		let force = new Vector(0, 0);
		wp.spots.forEach(spot => {
			let dis = Vector.distanceEuclidian(this.pos, spot.pos);
			if (dis < min && dis !== 0) {
				min = dis;
				min_point_pos.copy(spot.pos);
			}
		});
		force.copy(min_point_pos);
		force.subtract(this.pos);
		force.normalize();
		this.acc.subtract(force);
		this.acc.multiply(0.01);

		// Debug graph
		if (wp.debug) {
			wp.localCtx.beginPath();
			wp.localCtx.lineWidth = 1;
			wp.localCtx.strokeStyle = "red";
			wp.localCtx.moveTo(this.pos.x, this.pos.y);
			wp.localCtx.lineTo(min_point_pos.x, min_point_pos.y);
			wp.localCtx.closePath();
			wp.localCtx.stroke();
		}
	}
	update() {
		this.repulsion();
		this.vel.add(this.acc);
		this.vel.limit(this.maxVel);
		this.pos.add(this.vel);
		this.edges();
		this.acc.multiply(0);
	}
}

export default Spot;