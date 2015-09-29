"use strict";

var currentAudio;

/** A class for managing background audio */
export class BackgroundAudio {
	/**@param {string} mainAudio - Audio to use
	 * @param {string} [introAudio] - Option intro, can be used to play
	 * intro once, then loop <code>mainAudio</code> */
	constructor(mainAudio, introAudio) {
		this.audio = new Audio();
		this.audio.src = mainAudio;
		/* Use  an XHR and pass the data to an audioContext to leverage
		 * audio buffers instead of this. Maybe return a promise for
		 * completion? */
	}

	static get currentAudio() { return currentAudio; }
	static set currentAudio(audio) { return currentAudio = audio; }

	play(...args) {
		this.audio.play.apply(this.audio, args);
		BackgroundAudio.currentAudio = this.audio;
	}
}
