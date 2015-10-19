"use strict";

/**Easily manage transitioning values over time*/
export class Animator {
	/**@param {Function} func - When transitioning, `func(n)` is invoked, `n` being the new value of
	 * the transition
	 * @param {Integer} time - How much time in miliseconds should the transition take?
	 * @param {String|Array} bezier - What path should be used? Either an array similar to CSS3's
	 * cubic-bezier() or a shorthand (ease, ease-in, ease-out, eas-in-out, linear)
	 * @param {Integer} to - Number we want to end up with
	 * @param {Integer} [offset=0] - Offset to start transition at
	 * @param {Integar} [gran=20] - Granularity of transition */
	constructor(func, time, bezier, to, offset=0, gran=20) {
		this._stop = false;
		this.func = func;
		this.time = Math.round(time/gran);
		this.curve = cubicBezier(bezier, this.time);
		this.to = to;
		this.offset = offset;
		this.gran = gran;
		this.steps = 1;
		this.accu = Math.round( Date.now()/gran );
	}

	start() {
		this.step();
		return this;
	}

	step() {
		if(this._stop) return;
		this.func( Math.round(this.to * this.curve[this.steps] + this.offset) );
		var inaccu = Math.round( Date.now()/this.gran - this.accu - this.steps );
		if(++this.steps < this.time) setTimeout(_=> this.step(), this.gran-inaccu < 0? 0 : this.gran-inaccu);
	}

	/**Immediately halt the transition
	 * @param {Boolean} finalize - Should the cut to the final step? */
	stop(finalize) {
		this._stop = true;
		if(finalize) this.func(this.to);
	}
}

function cubicBezier(p, steps, duration) {
	var final = [];

	if(typeof p === 'string') {
		switch(p){
			case 'ease':			p = [.25, .1, .25, 1]; break;
			case 'ease-in-out':	p = [.42, 0, .58, 1]; break;
 
			case 'ease-in':
				for(var i=0; i<steps; i++) final.push( Math.pow(i / (steps-1), 1.685) );
				return final;
			case 'ease-out':
				for(var i=0; i<steps; i++) final.push( 1 - Math.pow(1-(i/(steps-1)), 1.685) );
				return final;
 
			case 'linear':
			default:
				for(var i=0; i<steps; i++) final.push( i/ (steps-1) );
				return final;
		}
	}
 
	var
		// X coefficients
		cx = 3 * p[0],
		bx = 3 * (p[2] - p[0]) - cx,
		ax = 1 - cx - bx,
		// Y Coefficients
		cy = 3 * p[1],
		by = 3 * (p[3] - p[1]) - cy,
		ay = 1 - cy - by,
		steps = steps-1 || 99;

	for(var i=0; i<steps+1; i++){
		var solvedX = i/steps;
		for(var x2,d2,i2=0; i2<6; i2++){
			x2 = (((ax * solvedX + bx) * solvedX + cx) * solvedX) - i/steps;
			if( Math.abs (x2) < (1 / (200 * (duration|| 50))) ) break;

			d2 = (3 * ax * solvedX + 2 * bx) * solvedX + cx;
			if( Math.abs(d2) < 1e-6 ) break;
			solvedX = solvedX - x2 / d2;
		}
		final.push( ((ay * solvedX + by) * solvedX + cy) * solvedX );
	}

	return final;
}
