/** A class for managing scene instruction methods */
export class SceneInstructor {
	/** @param {object} scope - Scope to bind instruction methods to */
	constructor(scope) {
		/** Scope methods will be bound to */
		this.scope = scope;

		/* Aliases */
		/** Alias of {@link SceneInstructor#jump} */
		this.goto = this.jump;
	}

	/**Gets a scene instruction method
	 * @param {string} method - The scene instruction name
	 * @param {*[]} args - An array of arguments to pass to the method
	 * @returns {Function} */
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
	
	/**Change the sprite of a character. Skips to the next scene.
	 * @param {string} charname - The character (in {@link Novel#cdata})'s name
	 * @param {string} mood - The name of the sprite to change to */
	setmood(charname, mood) {
		/* Since cd.characters is an array of objects, we need to spend
		 * some extra effort finding characters */
		var charIndex = -1;
		for(let c of this.cdata.characters) {
			if(c.character === charname) {
				charIndex = i;
				break;
			}
		}

		if(charIndex > -1) this.cdata.characters[charIndex].mood = mood || 'default';

		return true;
	}
	
	/**Hides a character from the screen. Does not skip to the next scene. */
	hide(character) { this.cdata.characters[character] = null; return false; }

	/**Shows a character on the screen. Skips to the next scene
	 * @param {string} charname - Name of the character to show
	 * @param {string} [pos] - Positio of the character on-screen
	 * @param {???} [wat] - Old code had four argumetns. No idea why
	 * @param {number} [priority] - Priority on screen. Lower numbers are on top. */
	show(charname, pos, wat, priority) {
		/* Check if we already have a cdata character mapped to charname */
		var charIndex = -1;
		for(let c of this.cdata.characters) {
			if(c.character === charname) {
				charIndex = i;
				break;
			}
		}

		if(charIndex > -1) {
			var cdChar = this.cdata.characters[charIndex];
			cdChar = {
				character: cdChar.character,
				position: pos || cdChar.position || 'middle',
				mood: cdChar.mood || 'default',
				priority: priority || cdChar.priority || 1
			};
		} else this.cdata.characters.push({ character: charname, position: pos||'middle', mood: 'default' });
	}

	/** Jump to a specific scene collection */
	jump(collection) { this.cdata.collection = collection; this.cdata.collectionIndex = 0; return false; }
}
