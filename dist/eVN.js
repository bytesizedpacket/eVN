(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @fileoverview A logging class, covering debug logs, warnings & errors
 * @module eVN/Logger
 * @param {string} [name='Unnamed Logger'] - The name of the logger. Will show up in logs.
 * @param {string} [version=NaN] - Version parameter, will show up in logs.
 * @param {bool} [doLog=true] - Whether or not to skip non warn/error logs.
 */
module.exports = function Logger(name, version, doLog) {
	this.name = name || 'Na Logger';
	this.version = version || 'NaN';
	this.DEBUG = doLog || true;
};

module.exports.prototype = {

	/**
	 * A method for logging regular errors.
	 * @param {string} message - Message to log.
	 */
	"log": function(message) {
		if(this.DEBUG === false) { return; }
		
		/* append arguments[] to a debug logging array then apply it */
		var argumentsArray = Array.prototype.slice.call(arguments);
		var args = [this.name +' v'+ this.version +' debug message:'].concat(argumentsArray);
		if(console) console.log.apply(console, args);
	},

	/**
	 * A method for sending warnings
	 * @param {string} message - Warning to send.
	 */
	"warn": function(message) {
		
		/* append arguments[] to a debug logging array then apply it */
		var argumentsArray = Array.prototype.slice.call(arguments);
		var args = [this.name +' v'+ this.version +' warning:'].concat(argumentsArray);
		if(console) console.warn.apply(console, args);
	},

	/**
	 * A method for throwing errors.
	 * @param {string|Error} message - Message of the error to throw.
	 * @param {string} [name=Unknown error] - Name of the error. Message will be used if none passed.
	 */
	"throw": function(message, name) {
		if(message instanceof Error   &&   console) {
			console.error((name? name : 'Unspecified') + ' error from ' + this.name + ' v' + this.version + ': ', message.message);
			console.error('Stacktrace:', message.stack);
			throw message;
		} else {
			var err = new Error();
			err.name = (name? name : 'Unspecified') + ' error from ' + this.name + ' v' + this.version;
			err["Error message"] = message;
			err.message = err.name + ': ' + message || 'Unspecified error. Refer to the stacktrace for help.';
	
			throw err;
		}
	}
};

},{}],2:[function(require,module,exports){
var Visuals = require('./Visuals.js');

/**
 * @fileoverview Core novel class
 * @module eVN/Novel
 * @param {object} canvas - The canvas element to attach.
 * @param {string} eVNML - The eVN script to load. <b>Must be valid JSON!</b>
 * @param {string} [file] - The name of the .evn script passed.
 */
module.exports = function Novel(canvas, eVNML, file) {
	this.file = file || 'undefined';
	
	/** The canvas attached to the instance */
	this.canvas = canvas;
	/** The drawing context of {@link module:eVN/Novel.canvas} */
	this.context = canvas.getContext('2d');

	/* Add the CSS class `eVN-canvas` to the canvas */
	//this.canvas.classList.add('eVN-canvas');
	this.canvas.className = this.canvas.className + ' eVN-canvas';

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

	/** Object containing simple character instances */
	this.characters = {};

	/**
	 * An instance that controls all graphic/drawing related stuff for the novel.
	 * @see module:eVN/Visuals
	 */
	this.visuals = new Visuals(this);
	
	/** JSON object containing all end-developer input (from .evn scripts) */
	this.eVNML = this.parse_eVNML(eVNML);

	/* Create an Image() from the passed textbox and optional speakerbox objects */
	if(this.eVNML.options.textbox.image) {
		this.textboxImage = new Image();
		this.textboxImage.src = this.eVNML.options.textbox.image;
	}
	if(this.eVNML.options.textbox.speakerbox.image) {
		this.speakerboxImage = new Image();
		this.speakerboxImage.src = this.eVNML.options.textbox.speakerbox.image;
	}

	/* Cache this.cdata to a lexical closure so anonymous functions can access it */
	var cdata = this.cdata;

	/* Go to the next scene on regular click */
	var _this = this;
	this.canvas.addEventListener('click', function onCanvasClick() {_this.parseScene.call(_this);});

	this.canvas.addEventListener('mousemove', function onMouseMove(e) {
		var target = e.target || e.srcElement;
		var rect = target.getBoundingClientRect();
		/* Two variables to modify the mouse coords relative to the scaling of the canvas */
		var fsModX = rect.width / target.width;
		var fsModY = rect.height / target.height;
		/* Export to Novel.cdata */
		cdata.mouseX = (e.clientX - rect.left) / fsModX |0;
		cdata.mouseY = (e.clientY - rect.top) / fsModY |0;
	});

	var cd = this.cdata;

	/* Import images */
	this.images = {};
	for(var imgKeys in this.eVNML.images) {
		this.images[imgKeys] = new Image();
		this.images[imgKeys].src = this.eVNML.images[imgKeys];
	}

	/* Instantiate characters */
	for(var key in this.eVNML.characters) {
		var eVNML_char = this.eVNML.characters[key];
		this.characters[key] = {
			name: eVNML_char['first name'] || eVNML_char['name'],
			lname: eVNML_char['last name'],
			color: eVNML_char['color'] || eVNML_char['colour'],
			images: {}
		};
		var char = this.characters[key];

		for(var imgKey in eVNML_char.images) {
			char.images[imgKey] = /*new Image();
			char.images[imgKey].src =*/ eVNML_char.images[imgKey];
		}
		char.cImage = char.images.default;
	}

	this.parseScene(cd.currentCollection, cd.collectionIndex);

	/* Push ourself to an array for easy debugging/hacking */
	var instanceIndex = eVN.instances.push(this) - 1;
	eVN.logger.log('Created new eVN instance from file `' + this.file + '` under eVN.instances['+ instanceIndex +']');
};

module.exports.prototype = {
	/** Validates the end-developer input and applies it on top of a set of default values */
	parse_eVNML: function(eVNML) {
		var defaults = require('./defaults.evn');
		var userData = eVNML;
		var returned_eVNML = defaults;

		try {
			userData = JSON.parse(eVNML);

			/**
			 * Returns an object of <code>alpha</code> obtrusively laid on top of <code>beta</code>
			 * param {object} alpha - The obtrusive object literal to apply on top of <code>beta</code>
			 * param {object beta - The submissive object literal to use as base for <code>alpha</code>
			 * returns {object}
			 */
			var merge = function(alpha, beta) {
				var out = beta;
				for(var prop in alpha) {
					if( !(prop in beta) ) out[prop] = alpha[prop];

					// If both properties are object literals, try merging those
					else if( alpha[prop].constructor === Object && beta[prop].constructor === Object) {
						out[prop] = merge(alpha[prop], beta[prop]);

					// Warn the end-developer if he possibly made a type mistake
					} else if ( alpha[prop].constructor !== beta[prop].constructor ) {
						eVN.logger.warn('Possible type mismatch on property "'+prop+'" while parsing eVNML.');
						out[prop] = alpha[prop];

					// Fall back to just overwriting the property
					}  else out[prop] = alpha[prop];
				}

				return out;
			};
			returned_eVNML = merge(userData, defaults);
		} catch(e) {
			eVN.logger.throw(e);
		}
	
		return returned_eVNML;
	},

	/**
	 * Imports `scene` to {@link module:eVN/Novel.cdata} and determines what to do with it
	 * @param {Object} scene - The scene to import
	 * @see <eVNML scene syntax>
	 */
	parseScene: function(collection, index) {
		var cd = this.cdata;
		var eVNML = this.eVNML;
		var textbox = eVNML.options.textbox;
		collection = collection || cd.collection;
		index = (typeof index !== 'undefined')? index : cd.collectionIndex;

		if(cd.startLine + textbox.lines < cd.dialogueLines.length) return cd.startLine += textbox.lines;

		var scene = this.eVNML.scenes[collection][index];
		cd.collection = collection;
		cd.collectionIndex = index+1;
		if(!scene) eVN.logger.throw('Undefined scene "'+ collection +'['+ index +']"! Did we run out of scenes?');

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

		switch(scene[0].toLowerCase()) {
		/* Cases ending with 'break' will not take up a scene shift and jump to the next scene automatically.
		   Cases ending with 'return' will not jump to the next scene when done */

			case 'background':
				cd.background = scene[1];
				break;
			case 'say':
				/*Process inline variables for text*/
				var text = this.processVariables(scene[1]);

				if(scene[2]) {
					cd.speaker = scene[2];
					cd.dialogue = '"'+ text +'"';
					cd.speakerColor = scene[3] || null;
				} else {
					cd.speaker = null;
					cd.dialogue = text;
				}

				//var maxWidth = this.context.canvas.width - (textbox.margin*2 + textbox.padding*2);
				var maxWidth = textbox.maxWidth;
				cd.dialogueLines = this.visuals.text.split(this.context, cd.dialogue, textbox.font.size, maxWidth);
				cd.startLine = 0;
				return;
			case 'setmood':
				var charIndex = -1;
				for(var i=0,l=cd.characters.length; i<l; i++) {
					if(cd.characters[i]['character'] === scene[1]) {
						charIndex = i;
						break;
					}
				}
				if(charIndex > -1){
					cd.characters[charIndex].mood = scene[2] || 'default';
				}
				break;
			case 'hide':
				cd.characters[scene[1]] = null;
				break;
			case 'show':
				/* Since characters are stored in an array and not an object literal,
				   checking if it exists takes a little extra effort */

				/* Check if we already have an index mapped to scene[1]||charName */
				var charIndex = -1;
				for(var i=0,l=cd.characters.length; i<l; i++) {
					if(cd.characters[i]['character'] === scene[1]) {
						charIndex = i;
						break;
					}
				}

				if(charIndex > -1) {
					var cdChar = cd.characters[charIndex];
					cdChar = {
						character: cdChar.character,
						position: scene[2] || cdChar.position || 'middle',
						mood: cdChar.mood || 'default',
						priority: scene[4] || cdChar.priority || 1
					};
				} else {
					cd.characters.push({ character: scene[1], position: scene[2]||'middle', mood: 'default' });
				}
				break;
			case 'goto':
			case 'jump':
				cd.collection = scene[1];
				cd.collectionIndex = 0;
				break;
			default:
				eVN.logger.warn('Unknown command "'+ scene[0] +'" at "'+ collection +'['+ index +']"');
		}

		this.parseScene();
	},

	/**
	 * Looks for ${varName} variables and returns the processed string
	 * @param {string} string - the string to process
	 */
	processVariables: function(string) {
		var splitAt = string.indexOf('${');
		var endAt = string.indexOf('}', splitAt);
		var output;
		if(splitAt !== -1   &&   endAt !== -1){
			var alpha = string.slice(0, splitAt);
			var beta = string.slice(splitAt+2, endAt);
			var gamma = string.slice(endAt+1);

			output = alpha +'Uncle Touchy'+ gamma;
			if(output.indexOf('${') !== -1) return this.processVariables(output);
			return output;
		} else {
			return string;
		}
	},

	/**
	 *
	 */
	constructCharacter: function(data) {
		var name = data.name;
		this.characters[name] = {};
	}
};

},{"./Visuals.js":3,"./defaults.evn":7}],3:[function(require,module,exports){
var text = require('./Visuals/text.js');
var draw = require('./Visuals/draw.js');
var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback) {setTimeout(callback, 1000/60);};

/** 
 * @fileoverview Class to manage and carry out drawing on a canvas, meant for {@link module:eVN/Novel}
 * @module eVN/Visuals
 * @param {object} novelInstance - Instance of {@link module:eVN/Novel} to pull data from and draw on
 */
module.exports = function Visuals(novelInstance) {

	/** Reference to the novel we are drawing */
	this.novel = novelInstance;
	this.ctx = novelInstance.context;

	var _this = this;
	rAF(function(timeframe){_this.loop.call(_this, timeframe);});
};

module.exports.prototype = {
	/** @see {@link module:eVN/Visuals/draw} */
	draw: draw,

	/** @see {@link module:eVN/Visuals/text} */
	text: text,

	/**
	 * Assembles graphics and exports to {@link eVN.NovelClass#outContext}, then calls itself in a timeout
	 */
	loop: function(frametime) {
		var novel = this.novel;
		var ctx = novel.context;
		var c = ctx;
		var cd = novel.cdata;
		var eVNML = novel.eVNML;

		var textbox = eVNML.options.textbox;
		var background = cd.background;
		var characters = novel.characters;
		var shownCharacters = novel.cdata.characters;

		/*
		 * BACKGROUND LAYERS
		 */
		if(background && background[0] !== '#'   &&   background in novel.images) background = novel.images[background];
		this.draw.background(c, background || '#FFF');
		
		/*
		 * CHARACTER LAYER
		 */
		/* Reverse sort the shownCharacters array by shownCharacters[i].priority */
		shownCharacters.sort(function(alpha, beta) {
			return alpha.priority - alpha.priority;
		});
		for(var i=0, l=shownCharacters.length; i<l; i++) {
			var charName = shownCharacters[i].character;
			var imgName = characters[charName].images[ cd.characters[i].mood ];
			var img = novel.images[imgName];
			var x;
			var y = c.canvas.height - img.height;
			
			switch(shownCharacters[i].position.toLowerCase()) {
				case 'left': x = c.canvas.width/4 - img.width/2; break;
				case 'right': x = c.canvas.width/4*3 - img.width/2; break;
				case 'middle':
				default: x = c.canvas.width/2 - img.width/2;
			}
			ctx.drawImage(img, x, y, img.width, img.height);
		}

		/*
		 * FOREGROUND LAYERS
		 */
		this.draw.dialogueBox(c, textbox, novel.textboxImage);
		//this.draw.speakerBox(c, textbox);

		var fontString = this.text.CSS_string(
			textbox.font.size,
			textbox.font.family,
			textbox.font.style,
			textbox.font.weight
		);

		ctx.fillStyle = textbox.font.color;
		ctx.textBaseline = 'top';
		ctx.font = fontString;

		var textToSay = cd.dialogue || '';
		//'A Dongner is a metaphysical entity believed to exist in a symbiotic relationship with the human soul. It does not have any control over the human body, nor can it interact directly with the physical realm in any way, however it has the same sensory input from the body as the soul it is attached to.';
		var textWidth = c.canvas.width - (textbox.margin*2 + textbox.padding*2);
		var textXstart = c.canvas.height - textbox.height - textbox.bottom + textbox.padding;
		var textYstart = textbox.margin + textbox.padding;
		var dialogue = cd.dialogueLines.slice(cd.startLine).slice(0, textbox.lines); //this.text.split(c, cd.dialogue, textbox.font.size, textWidth );


		this.draw.dialogueText(c, dialogue, textbox, textbox.lines);

		var name = cd.speaker || '';
		var speakerColor = cd.speakerColor || textbox.font.color;
		if(cd.speaker in novel.characters) {
			name = novel.characters[cd.speaker].name;
			speakerColor = novel.characters[cd.speaker].color;
		}
		this.draw.speakerText(c, name, textbox.speakerbox, speakerColor);

		/* Add `this` to a lexical closure and call this loop function with the appropriate binding */
		var _this = this;
		rAF(function rAF_wrap(frametime){_this.loop.call(_this, frametime);});
	}
};

},{"./Visuals/draw.js":4,"./Visuals/text.js":5}],4:[function(require,module,exports){
/**
 * @fileoverview Hosts mosts drawing in {@link module:eVN/Visuals}
 * @module eVN/Visuals/draw
 */

/**
 * Draws a background on <code>context</code>
 * @param {object} context - Rendering context to draw on
 * @param {(string|object)} background - Can be either a color shorthand, HEX value, rgb(), rgba() or an <code>Image</code>
 */
exports.background = function(context, background) {
	var ctx = context;
	var c = ctx;

	if(background instanceof Image) {
		ctx.drawImage(background, 0, 0, c.canvas.width, c.canvas.height);
	} else {
		ctx.fillStyle = background;
		ctx.fillRect(0, 0, c.canvas.width, c.canvas.height);
	}
};

/**
 * Draws the dialogue box
 * @param {object} context - Rendering context to draw on
 * @param {object} textboxOptions - The eVNML `textbox` option property
 * @param {object} image - The img object to draw
 */
exports.dialogueBox = function(context, textboxOptions, image) {
	var ctx = context;
	var box = textboxOptions;

	if(image) {
		var x = 0;
		var y = ctx.canvas.height - image.height;
		var width = image.width;
		var height = image.height;

		ctx.drawImage(image, x, y, width, height);
	} else {
		var x = 0;
		var y = ctx.canvas.height - box.speakerbox.bottom - 5;
		var width = ctx.canvas.width;
		var height = ctx.canvas.height;

		ctx.fillStyle = 'rgba(0, 0, 0, .35)';
		ctx.fillRect(x, y, width, height);
	}
};

/**
 * Draws the speaker box
 * @param {object} context - Rendering context to draw on
 * @param {object} textboxOptions - The eVNML `textbox` option property
 */
exports.speakerBox = function(context, textboxOptions) {
		var ctx = context;
		var box = textboxOptions;
		var sbox = box.speakerbox;
		var x = sbox.left;
		var y = ctx.canvas.height - sbox.bottom - sbox.height;
		var width = sbox.width;
		var height = sbox.height;

		ctx.fillStyle = sbox.color || box.color;
		ctx.fillRect(x, y, width, height);
};

/**
 * Function intended for drawing dialogue / monologue (though it can be used for anything)
 * @param {object} context - Rendering context to draw on
 * @param {string[]} text - The array of lines to draw <i>see: {@link eVN.NovelClass.VisualsClass.splitText})
 * @param {object} textboxOptions - Should be <code>eVNML.options.textbox</code>, object containing textbox properties
 * @param {number} maxLines - Maximum amount of lines to draw at a time
 */
exports.dialogueText = function(context, text, textboxOptions, maxLines) {
	var ctx = context;
	var box = textboxOptions;

	var lineHeight = box.lineHeight;
	//var maxWidth = ctx.canvas.width - box.margin*2 - box.padding*2;
	//var x = box.margin + box.padding;
	//var y = ctx.canvas.height - box.height - box.bottom + box.padding;
	var maxWidth = box.maxWidth;
	var x = box.left;
	var y = ctx.canvas.height - box.bottom;
	maxLines = maxLines || 3;

	for(var i=0, l=text.length; i< (l>maxLines? maxLines : l); i++) {
		var lineY = y + lineHeight*i;
		ctx.fillText(text[i], x, lineY, maxWidth);
	}
};

/**
 * Draws the speakerbox text
 * @param {object} context - Rendering context to draw on
 * @param {string} string - String to draw
 * @param {object} optionsSpeakerbox - Should be eVNML.textbox.speakerbox, used to determine where to put the text
 * @param {string} [color] - Color to use
 */
exports.speakerText = function(context, string, optionsSpeakerbox, color) {
	var ctx = context;
	var sbox = optionsSpeakerbox;

	var x = sbox.left;
	var y = ctx.canvas.height - sbox.bottom;
	var maxWidth = sbox.maxWidth || ctx.canvas.width - x;

	ctx.fillStyle = color || ctx.fillStyle;
	ctx.fillText(string, x, y, maxWidth);
};

},{}],5:[function(require,module,exports){
/**
 * @fileoverview Methods used in {@link module:eVN/Visuals} for rendering text
 * @module eVN/Visuals/text
 */

/* 
 * Explodes <code>string</code> into an array of strings that won't exceed <code>maxWidth</code> when drawn on <code>context</code>
 * @param {object} context - Context to probe .measureText() on
 * @param {string} string - The string to split
 * @param {number} fontSize - Font size of the context
 * @param {number} maxWidth - The maximum width of a string in the returned array <i>(in pixels)</i>
 * @param {bool} [doGuess=true] - Try estimating the line width using the font size and maxWidth propert
 * @param {string[]} [output] - An argument used by the function when recursing when concatenating previous attempts
 * @returns {string[]} An array containing slices of <code>string</code> with a maximum pixel width of <code>maxWidth</code>
 */
exports.split = function(context, string, fontSize, maxWidth, doGuess, output) {
	var ctx = context;

	doGuess = doGuess !== false;
	output = output || [];

	/* If the string contains a newline character, we'll split there and recurse */
	if(string.indexOf('\n') !== -1) {
		/* jshint shadow:true */
		var newlineIndex = string.indexOf('\n');
		var alpha = string.slice(0, newlineIndex);
		var beta = string.slice(newlineIndex+1);
		return this.split(context, alpha, fontSize, maxWidth).concat(this.split(context, beta, fontSize, maxWidth));
	}

	/* If the string already fits inside `maxWidth` or can't be split, we won't loop through it */
	if(ctx.measureText(string).width <= maxWidth) {
		return [string];
	}

	var words = string.split(' ');
	var probeFromIndex = words.length;

	if(doGuess) {
		/* Try guessing how many words to start probing with */
		var guessedLineLength = maxWidth / (fontSize /2.5);
		var probeFromChar = string.indexOf(' ', guessedLineLength);
		probeFromIndex = string.slice(0, probeFromChar).split(' ').length;

		/* If the probe index is larger than the actual length of the words array, just start at the end of the array */
		if(probeFromIndex > words.length) {
			probeFromIndex = words.length;
		}
	}

	/* Loop backwards through the array of words, starting at the guessed length or from the end */
	for(var i=probeFromIndex; i>=1; i--) {
		/* Split the array into two chunks and stringify them */
		var alpha = words.slice(0, i).join(' ');
		var beta = words.slice(i, words.length).join(' ');

		var width = ctx.measureText(alpha).width;

		/* If the first chunk fits inside `maxWidth` on the first loop, we guessed too low. Restart without guessing */
		if(doGuess === true   &&   width < maxWidth   &&   i === probeFromIndex) {
			return this.split(context, string, fontSize, maxWidth, false);
		}

		/* If the first chunk fits inside `maxWidth`, append it to the finished string.
		   If the second chunk is empty, return `output`, otherwise try again */
		if(width < maxWidth) {
			output.push(alpha);
			return beta? output.concat(this.split(context, beta, fontSize, maxWidth)) : output;
		}
	}

	/* If the script hasn't returned by now, it wasn't able to split the first index of `words`.
	   Append it to the output and give the end-developer a warning, recursive if there are more words left. */
	eVN.logger.warn('Unable to split word "'+ words[0] +'".');
	output.push(words.shift());
	if(words.length >= 1) {
		return output.concat(this.split(context, words.join(' '), fontSize, maxWidth));
	} else {
		return output;
	}
};

/**
 * Generate a valid CSS font string
 * @param {string} [size=18] - The font-size to use in pixels
 * @param {string} [family=Comic Neue] - The font-family to use
 * @param {string} [style=normal] - Text style ('normal', 'italic', 'oblique')
 * @param {string} [weight=normal] - The weight to use (i.e. 'bold')
 * @returns {string} valid CSS font property value
 */
exports.CSS_string = function(size, family, style, weight) {
	size = size || 18;
	family = family || 'Comic Neue';
	style = style || 'normal';
	weight = weight || 'normal';

	family = family[0]==="'"? family : family[0]==='"'? family : "'"+family+"'";

	return style +' '+ weight +' '+ size+'px '+ family;
};

},{}],6:[function(require,module,exports){
/** @fileoverview Base64-encoded Comic Neue .woff font, used as default/fallback */

module.exports = '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';

},{}],7:[function(require,module,exports){
/** @fileoverview A default .evn file to  make development & starting out easier */

module.exports = {
	"options": {
		"textbox": {
			"font": {
				"size": "17",
				"family": "Comic Neue",
				"style": "normal",
				"weight": "normal",
				"color": "#EEE",
			},

			"lines": 3,
			"lineHeight": "22",
			"bottom": 95,
			"left": 40,
			"maxWidth": 750,

			"speakerbox" : {
				"left": 25,
				"bottom": 130,
				"maxWidth": 150,
			}
		},
	},

	"audio": {},

	"images": {},

	"characters": {},

	"scenes": {
		start: ["No scenes defined!"]
	}
}

},{}],8:[function(require,module,exports){
/**
 * eVN - Everyone's Visual Novel (Development build)
 * @see {@link https://github.com/bytesizedpacket/eVN}
 * @fileOverview eVN core script
 * @author Jacob Pedersen <jacob@bytesizedpacket.com> & Byte-Sized Packet <contact@bytesizedpacket.com>
 * @copyright Byte-Sized Packet 2015
 * @license {@link https://github.com/bytesizedpacket/eVN/blob/master/LICENSE | Attribution Assurance License (BSP edit)}
 * @version: 0.0.1a Pre-development version
 */

/* Import some modules */
var Logger = require('./Logger.js');
var onPageLoad = require('./onPageLoad.js');
var Novel = require('./Novel.js');

/** @namespace eVN */
window.eVN = window.eVN || {};

/** Version */
eVN.VERSION = '0.0.1a';


/** @see module:eVN/Logger */
eVN.logger = new Logger('eVN Logger', eVN.VERSION, true);

/** @see module:eVN/onPageLoad */
eVN.onPageLoad = onPageLoad;

/**
 * Stylesheet used for adding fonts and full-screen styles.
 * You can insert your own style tag with the id `eVN-stylesheet` and it'll use that.
 * <i>This lets you generate a nonce hash and apply it to achieve CSP compliance!</i>
 * @see {@link http://www.html5rocks.com/en/tutorials/security/content-security-policy/#inline-code-considered-harmful}
 */
eVN.stylesheet = (function() {
	/* If a tag with the id `eVN-stylesheet` exists, we'll assume it's a <style> tag we can use for injecting rules
	   This lets end-developers insert their own <style> tag with a `nonce=` attribute if they need CSP compliance. */
	var stylesheet = document.getElementById('eVN-stylesheet') || document.createElement('style');
	document.head.appendChild(stylesheet);
	return stylesheet.sheet;
})();

/** Instances (for debugging/hacking) */
eVN.instances = [];

/**
 * Class for handling novels
 * @see eVN.NovelClass
 */
eVN.Novel = Novel;



/* Execute our onPageLoad() function as soon as the browser has everything loaded */
document.addEventListener('DOMContentLoaded', eVN.onPageLoad);

setTimeout(function(){window.t=eVN.instances[0];}, 500);

},{"./Logger.js":1,"./Novel.js":2,"./onPageLoad.js":9}],9:[function(require,module,exports){
/**
 * A function to run when the page is done loading
 * Loads the fallback font ([Comic Neue]{@link http://comicneue.com/}),
 * Injects CSS styles for fullscreen mode,
 * finds canvas tags with `evn-data` attributes and creates novel instances for each
 * @module eVN/onPageLoad
 */
module.exports = function onPageLoad() {
	
	/* Load Comic Neue as a default/fallback font */
	eVN.stylesheet.insertRule('@font-face{font-family: "Comic Neue"; src: url("data:application/font-woff;charset=utf-8;base64,' + require('./comicNeue.b64') + '") format("woff"); font-weight: normal; font-style: normal;}', 0);

	/* Add style for fullscren viewing */
	(function attempt(selectorIndex) {
		var pseudoSelectors = [':fullscreen', ':-webkit-full-screen', ':-moz-full-screen', ':-ms-fullscreen'];
		var index = selectorIndex || 0;

		try {
			eVN.stylesheet.insertRule('.eVN-canvas'+ pseudoSelectors[index] +'{position:absolute; height:100%; width:auto; max-width:100%; image-rendering:optimizeQuality; top:0; left:0; right:0; margin:auto}', 1);
		} catch(e) {
			if(index+1 >= pseudoSelectors.length) {
				eVN.logger.warn('Unable to find valid vendor prefix while inserting CSS rules for fullscreen mode - fullscreen will be disabled.');
				eVN.fullscreenSafe = false;
			} else {
				attempt(index+1);
			}
		}
	})();

	/* Grab all canvas elements, select ones with `data-evn` attributes and create eVN instances for each */
	var canvases = document.getElementsByTagName('canvas');

	/* Function to run on canvases with loaded `data-evn` attributes */
	var onEvnDataReady = function() {
		if(xhr.readyState === 4 && xhr.status === 200){
			new eVN.Novel(canvas, xhr.responseText, evnData);
		}
	};

	for(var i=0,l=canvases.length; i<l; i++){
		var canvas = canvases[i];
		var evnData = canvas.dataset? canvas.dataset.evn : canvas.getAttribute('data-evn');
		if(evnData){
			var xhr = new XMLHttpRequest();
			xhr.open('GET', evnData, true);
			xhr.onreadystatechange = onEvnDataReady;
			xhr.send();
		}
	}
};

},{"./comicNeue.b64":6}]},{},[1,2,3,4,5,6,7,8,9]);
