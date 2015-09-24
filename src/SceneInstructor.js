/** A class for managing scene instruction methods */
export class SceneInstructor {
	/** @param {object} scope - Scope to bind instruction methods to */
	constructor(scope) {
		/** Scope methods will be bound to */
		this.scope = scope;

		/* Aliases */
		this.get = this.getMethod;
	}

	getMethod(method, args) {
		var meth = this[method];
		if(meth instanceof Function) {
			return meth.bind(this.scope, ...args);
		} else return null;
	}

	/** Sets the background of a scene. Skips to the next scene. */
	background(background) { this.cdata.background = background; return false; }
			
	/** Changes the background music. Skips to the next scene. */
	music(track) { if(track in this.audio) this.audio[track].play(); return false; }
	
	/**Changes the contents of the dialogue & speaker box. Does NOT skip to the next scene.
	 * @param {string} text - Dialogue to say
	 * @param {string} [speaker=null] - The person talking -Improve this-
	 * @param {string} [speakerColor='#FFF'] - #HEX or rgb() color of the speaker's name */
	say(text, speaker=null, speakerColor='#FFF') {
		var cd = this.cdata;
		var textbox = this.eVNML.options.textbox;
		/*Process inline variables for text*/
		text = this.processVariables(text);

		if(speaker !== null) {
			cd.speaker = speaker;
			cd.dialogue = '"'+ text +'"';
			cd.speakerColor = speakerColor;
		} else cd.dialogue = text;

		var maxWidth = textbox.maxWidth;
		cd.dialogueLines = this.visuals.text.split(this.context, cd.dialogue, textbox.font.size, maxWidth);
		cd.startLine = 0;
		return true;
	}
}
