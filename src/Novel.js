import { Visuals } from './Visuals.js';
import { Character } from './Character.js';
import { BackgroundAudio } from './BackgroundAudio.js';
import { SceneInstructor } from './SceneInstructor.js';
var logger = null;
var defaultEvnData = {
	options: {
		textbox: {
			font: { size: 17, family: 'Comic Neue', style: 'normal', weight: 'normal', color: '#EEE' },
			lines: 3, lineHeight: 22, bottom: 95, left: 40, maxWidth: 750,
			speakerbox: { left: 25, bottom: 130, maxWidth: 150 }
		},
	},
	audio: {}, images: {}, characters: {},
	scenes: {start: ['No scenes defined']}
};
/* Empty eVN project = JSON.stringify(defaultEvnData, null, '\t'); */

/** Core novel class */
export class Novel {
	/**@param {object} canvas - The canvas element to attach.
	 * @param {string} eVNML - The eVN script to load. <b>Must be valid JSON!</b>
	 * @param {string} [file='undefined'] - The name of the .evn script passed. */
	constructor(canvas, eVNML, file='undefined') {
		logger = eVN.logger;
		/** Filename of the eVNL the novel was instantiated with */
		this.file = file;
		/** The canvas attached to the instance */
		this.canvas = canvas;
		/** The drawing context of {@link Novel#canvas} */
		this.context = canvas.getContext('2d');
		/** {@link SceneInstructor} for this novel */
		this.sceneInstructor = new SceneInstructor(this);
		/** Shorthand for executing scene instruction methods */
		this.sceneCmd = this.sceneInstructor.execute;
		/** Map containing all <code>Image</code> instances for this novel */
		this.images = {};
		/** Map containing all <code>Audio</code> instances for this novel */
		this.audio = {};
		/** Object containing character instances */
		this.characters = {};
		/** JSON object containing all end-developer input (from .evn scripts) */
		this.eVNML = this.parse_eVNML(eVNML);
		/**An instance that controls all graphic/drawing related stuff for the novel.
		 * @see {@link Visuals} */
		this.visuals = new Visuals(this);
		/** Map containing dynamic data for handling the current scene */
		this.cdata = {
			background: null,
			characters: [],
			collection: 'start',
			collectionIndex: 0,
			dialogue: '',
			dialogueLines: [],
			mouseX: -1,
			mouseY: -1,
			jobs: [],
			startLine: 0,
			speaker: ''
		};

		/* Add the CSS class `eVN-canvas` to the canvas */
		this.canvas.className = this.canvas.className + ' eVN-canvas';

		/* Create an Image() from the passed textbox and optional speakerbox objects */
		if(this.eVNML.options.textbox.image) {
			this.images.textbox = new Image();
			this.images.textbox.src = this.eVNML.options.textbox.image;
		}
		if(this.eVNML.options.textbox.speakerbox.image) {
			this.images.speakerbox = new Image();
			this.images.speakerbox.src = this.eVNML.options.textbox.speakerbox.image;
		}

		/* Go to the next scene on regular click */
		this.canvas.addEventListener('click', ()=> this.parseScene.call(this));

		/* Update this.cdata.mouse values */
		this.canvas.addEventListener('mousemove', e=> {
			var target = e.target || e.srcElement;
			var rect = target.getBoundingClientRect();
			/* Two variables to modify the mouse coords relative to the scaling of the canvas */
			var fsModX = rect.width / target.width;
			var fsModY = rect.height / target.height;
			/* Export to Novel.cdata */
			this.cdata.mouseX = Math.round( (e.clientX - rect.left) / fsModX );
			this.cdata.mouseY = Math.round( (e.clientY - rect.top) / fsModY );
		});

		/* Import images & audio */
		for(let key in this.eVNML.images) {
			this.images[key] = new Image();
			this.images[key].src = this.eVNML.images[key];
		}
		for(let key in this.eVNML.audio) this.audio[key] = new BackgroundAudio(this.eVNML.audio[key]);

		/* Instantiate characters */
		for(let key in this.eVNML.characters) this.characters[key] = new Character(this.eVNML.characters[key]);

		this.parseScene(this.cdata.currentCollection, this.cdata.collectionIndex);

		/* Push ourself to an array for easy debugging/hacking */
		var instanceIndex = eVN.instances.push(this) - 1;
		logger.log('Created new eVN instance from file `' + this.file + '` under eVN.instances['+ instanceIndex +']')();
	}

	// --------------------------- //
	
	/** Validates the end-developer input and applies it on top of a set of default values */
	parse_eVNML(eVNML) {
		var userData = eVNML;
		var returned_eVNML = defaultEvnData;

		try {
			userData = JSON.parse(eVNML);

			/**Returns an object of <code>alpha</code> obtrusively laid on top of <code>beta</code>
			 * param {object} alpha - The obtrusive object literal to apply on top of <code>beta</code>
			 * param {object beta - The submissive object literal to use as base for <code>alpha</code>
			 * returns {object} */
			var merge = function(alpha, beta) {
				var out = beta;
				for(let prop in alpha) {
					if( !(prop in beta) ) out[prop] = alpha[prop];

					// If both properties are object literals, try merging those
					else if( alpha[prop].constructor === Object && beta[prop].constructor === Object) {
						out[prop] = merge(alpha[prop], beta[prop]);

					// Warn the end-developer if he possibly made a type mistake
					} else if ( alpha[prop].constructor !== beta[prop].constructor ) {
						eVN.logger.warn('Possible type mismatch on property "'+prop+'" while parsing eVNML.')();
						out[prop] = alpha[prop];

					// Fall back to just overwriting the property
					}  else out[prop] = alpha[prop];
				}

				return out;
			};
			returned_eVNML = merge(userData, defaultEvnData);
		} catch(e) {
			eVN.logger.throw(e);
		}
	
		return returned_eVNML;
	}

	/**Imports `scene` to {@link module:eVN/Novel.cdata} and determines what to do with it
	 * @param {Object} scene - The scene to import
	 * @see <eVNML scene syntax> */
	parseScene(collection, index) {
		var cd = this.cdata;
		var eVNML = this.eVNML;
		var textbox = eVNML.options.textbox;
		collection = collection || cd.collection;
		index = (typeof index !== 'undefined')? index : cd.collectionIndex;

		if(cd.startLine + textbox.lines < cd.dialogueLines.length) return cd.startLine += textbox.lines;

		var scene = this.eVNML.scenes[collection][index];
		cd.collection = collection;
		cd.collectionIndex = index+1;
		if(!scene) eVN.logger.throw('Undefined scene "'+ collection +'['+ index +']"! Did we run out of scenes?')();

		/* These are values that only live one scene - they should be reset on each scene load */
		cd.speakerColor = null;

		/* If the scene is a string, it's using the dialogue shorthand */
		if(typeof scene === 'string') {
			var splitAt = scene.indexOf(': ');
			var alpha = scene.slice(0, splitAt);
			var beta = scene.slice(splitAt+2);

			/* If the alpha exists as a key in the characters object, it's dialogue, if not monologue */
			var isDialogue = splitAt < scene.indexOf(' ')   &&   alpha in this.characters;
			scene = isDialogue? ["say", beta, alpha] : ["say", scene];
		}

		var sceneInstruction = this.sceneInstructor.getMethod( scene[0].toLowerCase(), scene.slice(1) );
		if(sceneInstruction !== null) {
			var doSkip = sceneInstruction() || false;
			if(doSkip) return;
		} else logger.warn('Unknown command "'+ scene[0] +'" at "'+ collection +'['+ index +']"')();

		this.parseScene();
	}

	/**Looks for ${varName} variables and returns the processed string
	 * @param {string} string - the string to process */
	processVariables(string) {
		var splitAt = string.indexOf('${');
		var endAt = string.indexOf('}', splitAt);
		var output = '';
		if(splitAt !== -1   &&   endAt !== -1){
			var alpha = string.slice(0, splitAt);
			var beta = string.slice(splitAt+2, endAt);
			var gamma = string.slice(endAt+1);
			output = beta;

			var varSplit = beta.split('.');
			// If beta (variable name) exists in cdata.characters,it's
			// probably referring to a property of a character
			var characterIndex = this.cdata.characters.map(function(e){ return e.character; }).indexOf(varSplit[0]);
			if(varSplit[0] in this.characters) {
				output = this.characters[varSplit[0]][varSplit[1]];
			}

			output = alpha + output + gamma;
			if(output.indexOf('${') !== -1) return this.processVariables(output);
			return output;
		} else {
			return string;
		}
	}
};
