/**
 * eVN - Everyone's Visual Novel (Development build)
 * @see {@link https://github.com/bytesizedpacket/eVN}
 * @fileOverview eVN core script
 * @author Jacob Pedersen <jacob@bytesizedpacket.com> & Byte-Sized Packet <contact@bytesizedpacket.com>
 * @copyright Byte-Sized Packet 2015
 * @license {@link https://github.com/bytesizedpacket/eVN/blob/master/LICENSE | Attribution Assurance License (BSP edit)}
 * @version: 0.0.1a Pre-development version */

"use strict";

/* Fire up our logger */
import { Novel } from './Novel.js';
import { Logger } from './Logger.js';
var logger = new Logger('eVN', '0.1a', true);

/**Main class keeping the system together
 * Instantiated as <code>window.eVN</code> by default */
export var Main = class {
	/**Load up an array for storing novel instances */
	constructor()  {
		/** Instances (for debugging/hacking) */
		this.instances = [];
	};

	/** @returns {Logger} */
	get logger() { return logger; }
}

if(!!window.eVN) logger.throw('`window.eVN` is already declared')();
/** @namespace eVN */
else window.eVN = new Main();

/* Find <code>&lt;canvas&gt;</code> tags with <code>data-evn</code>
 * attributes and instantiate them as novels */
document.addEventListener('DOMContentLoaded', function() {
	/* Grab all canvas elements, select ones with `data-evn` attributes and create eVN instances for each */
	var canvases = Array.prototype.slice.call( document.getElementsByTagName('canvas') );
	for(let canvas of canvases) {
		var evnData = canvas.getAttribute('data-evn');
		if(!evnData) return;

		var xhr = new XMLHttpRequest();
		xhr.open('GET', evnData, true);
		xhr.onreadystatechange = ()=> {
			if(xhr.readyState === 4 && xhr.status === 200) new Novel(canvas, xhr.responseText, evnData);
		};
		xhr.send();
	}
});

setTimeout(function(){
	window.t=eVN.instances[0];
//	document.body.onclick=t.canvas.webkitRequestFullScreen
}, 500);
import { BackgroundAudio } from './BackgroundAudio.js';
window.bga = BackgroundAudio;
import { Animator } from './Animator.js';
window.anim = Animator;
