/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * eVN - Everyone's Visual Novel (Development build)
	 * @see {@link https://github.com/bytesizedpacket/eVN}
	 * @fileOverview eVN core script
	 * @author Jacob Pedersen <jacob@bytesizedpacket.com> & Byte-Sized Packet <contact@bytesizedpacket.com>
	 * @copyright Byte-Sized Packet 2015
	 * @license {@link https://github.com/bytesizedpacket/eVN/blob/master/LICENSE | Attribution Assurance License (BSP edit)}
	 * @version: 0.0.1a Pre-development version */

	/* Fire up our logger */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _NovelJs = __webpack_require__(1);

	var _LoggerJs = __webpack_require__(7);

	var logger = new _LoggerJs.Logger('eVN', '0.1a', true);

	/**Main class keeping the system together
	 * Instantiated as <code>window.eVN</code> by default */
	var Main = (function () {
		/**Load up an array for storing novel instances */

		function Main() {
			_classCallCheck(this, Main);

			/** Instances (for debugging/hacking) */
			this.instances = [];
		}

		_createClass(Main, [{
			key: 'logger',

			/** @returns {Logger} */
			get: function get() {
				return logger;
			}
		}]);

		return Main;
	})();

	exports.Main = Main;
	if (!!window.eVN) logger['throw']('`window.eVN` is already declared')();
	/** @namespace eVN */
	else window.eVN = new Main();

	/* Find <code>&lt;canvas&gt;</code> tags with <code>data-evn</code>
	 * attributes and instantiate them as novels */
	document.addEventListener('DOMContentLoaded', function () {
		/* Grab all canvas elements, select ones with `data-evn` attributes and create eVN instances for each */
		var canvases = Array.prototype.slice.call(document.getElementsByTagName('canvas'));
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			var _loop = function () {
				var canvas = _step.value;
				evnData = canvas.getAttribute('data-evn');

				if (!evnData) return {
						v: undefined
					};

				xhr = new XMLHttpRequest();

				xhr.open('GET', evnData, true);
				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4 && xhr.status === 200) new _NovelJs.Novel(canvas, xhr.responseText, evnData);
				};
				xhr.send();
			};

			for (var _iterator = canvases[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var evnData;
				var xhr;

				var _ret = _loop();

				if (typeof _ret === 'object') return _ret.v;
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator['return']) {
					_iterator['return']();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	});

	setTimeout(function () {
		window.t = eVN.instances[0];
		//	document.body.onclick=t.canvas.webkitRequestFullScreen
	}, 500);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _VisualsJs = __webpack_require__(2);

	var _CharacterJs = __webpack_require__(5);

	var _SceneInstructorJs = __webpack_require__(6);

	var logger = null;
	var defaultEvnData = {
		options: {
			textbox: {
				font: { size: 17, family: 'Comic Neue', style: 'normal', weight: 'normal', color: '#EEE' },
				lines: 3, lineHeight: 22, bottom: 95, left: 40, maxWidth: 750,
				speakerbox: { left: 25, bottom: 130, maxWidth: 150 }
			}
		},
		audio: {}, images: {}, characters: {},
		scenes: { start: ['No scenes defined'] }
	};
	/* Empty eVN project = JSON.stringify(defaultEvnData, null, '\t'); */

	/** Core novel class */

	var Novel = (function () {
		/**@param {object} canvas - The canvas element to attach.
	  * @param {string} eVNML - The eVN script to load. <b>Must be valid JSON!</b>
	  * @param {string} [file='undefined'] - The name of the .evn script passed. */

		function Novel(canvas, eVNML) {
			var _this = this;

			var file = arguments.length <= 2 || arguments[2] === undefined ? 'undefined' : arguments[2];

			_classCallCheck(this, Novel);

			logger = eVN.logger;
			/** Filename of the eVNL the novel was instantiated with */
			this.file = file;
			/** The canvas attached to the instance */
			this.canvas = canvas;
			/** The drawing context of {@link Novel#canvas} */
			this.context = canvas.getContext('2d');
			/** {@link SceneInstructor} for this novel */
			this.sceneInstructor = new _SceneInstructorJs.SceneInstructor(this);
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
			this.visuals = new _VisualsJs.Visuals(this);
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
			if (this.eVNML.options.textbox.image) {
				this.images.textbox = new Image();
				this.images.textbox.src = this.eVNML.options.textbox.image;
			}
			if (this.eVNML.options.textbox.speakerbox.image) {
				this.images.speakerbox = new Image();
				this.images.speakerbox.src = this.eVNML.options.textbox.speakerbox.image;
			}

			/* Go to the next scene on regular click */
			this.canvas.addEventListener('click', function () {
				return _this.parseScene.call(_this);
			});

			/* Update this.cdata.mouse values */
			this.canvas.addEventListener('mousemove', function (e) {
				var target = e.target || e.srcElement;
				var rect = target.getBoundingClientRect();
				/* Two variables to modify the mouse coords relative to the scaling of the canvas */
				var fsModX = rect.width / target.width;
				var fsModY = rect.height / target.height;
				/* Export to Novel.cdata */
				_this.cdata.mouseX = Math.round((e.clientX - rect.left) / fsModX);
				_this.cdata.mouseY = Math.round((e.clientY - rect.top) / fsModY);
			});

			/* Import images & audio */
			for (var key in this.eVNML.images) {
				this.images[key] = new Image();
				this.images[key].src = this.eVNML.images[key];
			}
			for (var key in this.eVNML.audio) {
				this.audio[key] = new Audio();
				this.audio[key].src = this.eVNML.audio[key];
			}

			/* Instantiate characters */
			for (var key in this.eVNML.characters) {
				this.characters[key] = new _CharacterJs.Character(this.eVNML.characters[key]);
			}this.parseScene(this.cdata.currentCollection, this.cdata.collectionIndex);

			/* Push ourself to an array for easy debugging/hacking */
			var instanceIndex = eVN.instances.push(this) - 1;
			logger.log('Created new eVN instance from file `' + this.file + '` under eVN.instances[' + instanceIndex + ']')();
		}

		// --------------------------- //

		/** Validates the end-developer input and applies it on top of a set of default values */

		_createClass(Novel, [{
			key: 'parse_eVNML',
			value: function parse_eVNML(eVNML) {
				var userData = eVNML;
				var returned_eVNML = defaultEvnData;

				try {
					userData = JSON.parse(eVNML);

					/**Returns an object of <code>alpha</code> obtrusively laid on top of <code>beta</code>
	     * param {object} alpha - The obtrusive object literal to apply on top of <code>beta</code>
	     * param {object beta - The submissive object literal to use as base for <code>alpha</code>
	     * returns {object} */
					var merge = function merge(alpha, beta) {
						var out = beta;
						for (var prop in alpha) {
							if (!(prop in beta)) out[prop] = alpha[prop];

							// If both properties are object literals, try merging those
							else if (alpha[prop].constructor === Object && beta[prop].constructor === Object) {
									out[prop] = merge(alpha[prop], beta[prop]);

									// Warn the end-developer if he possibly made a type mistake
								} else if (alpha[prop].constructor !== beta[prop].constructor) {
										eVN.logger.warn('Possible type mismatch on property "' + prop + '" while parsing eVNML.');
										out[prop] = alpha[prop];

										// Fall back to just overwriting the property
									} else out[prop] = alpha[prop];
						}

						return out;
					};
					returned_eVNML = merge(userData, defaultEvnData);
				} catch (e) {
					eVN.logger['throw'](e);
				}

				return returned_eVNML;
			}

			/**Imports `scene` to {@link module:eVN/Novel.cdata} and determines what to do with it
	   * @param {Object} scene - The scene to import
	   * @see <eVNML scene syntax> */
		}, {
			key: 'parseScene',
			value: function parseScene(collection, index) {
				var cd = this.cdata;
				var eVNML = this.eVNML;
				var textbox = eVNML.options.textbox;
				collection = collection || cd.collection;
				index = typeof index !== 'undefined' ? index : cd.collectionIndex;

				if (cd.startLine + textbox.lines < cd.dialogueLines.length) return cd.startLine += textbox.lines;

				var scene = this.eVNML.scenes[collection][index];
				cd.collection = collection;
				cd.collectionIndex = index + 1;
				if (!scene) eVN.logger['throw']('Undefined scene "' + collection + '[' + index + ']"! Did we run out of scenes?')();

				/* These are values that only live one scene - they should be reset on each scene load */
				cd.speakerColor = null;

				/* If the scene is a string, it's using the dialogue shorthand */
				if (typeof scene === 'string') {
					var splitAt = scene.indexOf(': ');
					var alpha = scene.slice(0, splitAt);
					var beta = scene.slice(splitAt + 2);

					/* If the alpha exists as a key in the characters object, it's dialogue, if not monologue */
					var isDialogue = splitAt < scene.indexOf(' ') && alpha in this.characters;
					scene = isDialogue ? ["say", beta, alpha] : ["say", scene];
				}

				var sceneInstruction = this.sceneInstructor.getMethod(scene[0].toLowerCase(), scene.slice(1));
				if (sceneInstruction !== null) {
					var doSkip = sceneInstruction() || false;
					if (doSkip) return;
				} else switch (scene[0].toLowerCase()) {
					/* Cases ending with 'break' will not take up a scene shift and jump to the next scene automatically.
	       Cases ending with 'return' will not jump to the next scene when done */

					case 'setmood':
						var charIndex = -1;
						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = cd.characters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var c = _step.value;

								if (c['character'] === scene[1]) {
									charIndex = i;
									break;
								}
							}
						} catch (err) {
							_didIteratorError = true;
							_iteratorError = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion && _iterator['return']) {
									_iterator['return']();
								}
							} finally {
								if (_didIteratorError) {
									throw _iteratorError;
								}
							}
						}

						if (charIndex > -1) {
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
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {
							for (var _iterator2 = cd.characters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var c = _step2.value;

								if (c['character'] === scene[1]) {
									charIndex = i;
									break;
								}
							}
						} catch (err) {
							_didIteratorError2 = true;
							_iteratorError2 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion2 && _iterator2['return']) {
									_iterator2['return']();
								}
							} finally {
								if (_didIteratorError2) {
									throw _iteratorError2;
								}
							}
						}

						if (charIndex > -1) {
							var cdChar = cd.characters[charIndex];
							cdChar = {
								character: cdChar.character,
								position: scene[2] || cdChar.position || 'middle',
								mood: cdChar.mood || 'default',
								priority: scene[4] || cdChar.priority || 1
							};
						} else {
							cd.characters.push({ character: scene[1], position: scene[2] || 'middle', mood: 'default' });
						}
						break;
					case 'goto':
					case 'jump':
						cd.collection = scene[1];
						cd.collectionIndex = 0;
						break;
					default:
						eVN.logger.warn('Unknown command "' + scene[0] + '" at "' + collection + '[' + index + ']"');
				}

				this.parseScene();
			}

			/**Looks for ${varName} variables and returns the processed string
	   * @param {string} string - the string to process */
		}, {
			key: 'processVariables',
			value: function processVariables(string) {
				var splitAt = string.indexOf('${');
				var endAt = string.indexOf('}', splitAt);
				var output = '';
				if (splitAt !== -1 && endAt !== -1) {
					var alpha = string.slice(0, splitAt);
					var beta = string.slice(splitAt + 2, endAt);
					var gamma = string.slice(endAt + 1);
					output = beta;

					var varSplit = beta.split('.');
					// If beta (variable name) exists in cdata.characters,it's
					// probably referring to a property of a character
					var characterIndex = this.cdata.characters.map(function (e) {
						return e.character;
					}).indexOf(varSplit[0]);
					if (varSplit[0] in this.characters) {
						output = this.characters[varSplit[0]][varSplit[1]];
					}

					output = alpha + output + gamma;
					if (output.indexOf('${') !== -1) return this.processVariables(output);
					return output;
				} else {
					return string;
				}
			}
		}]);

		return Novel;
	})();

	exports.Novel = Novel;
	;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	//var text = require('./Visuals/text.js');
	//var draw = require('./Visuals/draw.js');

	var _VisualsTextJs = __webpack_require__(3);

	var text = _interopRequireWildcard(_VisualsTextJs);

	var _VisualsDrawJs = __webpack_require__(4);

	var draw = _interopRequireWildcard(_VisualsDrawJs);

	var logger = null;
	var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
		setTimeout(callback, 1000 / 60);
	};

	/**Class to manage and carry out drawing on a canvas, meant for {@link module:eVN/Novel}
	 */

	var Visuals = (function () {
		/** @param {Novel} novelInstance - Novel to pull data from */

		function Visuals(novelInstance) {
			var _this = this;

			_classCallCheck(this, Visuals);

			logger = eVN.logger;
			/** Reference to the novel we are drawing */
			this.novel = novelInstance;
			this.ctx = novelInstance.context;

			// Temporary. remove this. These are pulled from text/draw.js -
			// should be rewritten.
			/* @ignore */
			this.draw = draw;
			/** @ignore */
			this.text = text;

			rAF(function (timeframe) {
				return _this.loop(timeframe);
			});
		}

		/** Assembles graphics and exports to {@link Novel#outContext}, then calls itself in a timeout */

		_createClass(Visuals, [{
			key: 'loop',
			value: function loop(frametime) {
				var _this2 = this;

				var novel = this.novel;
				var ctx = novel.context;
				var cd = novel.cdata;

				var textbox = novel.eVNML.options.textbox;
				var bgName = cd.background;
				var background = null;
				var characters = novel.characters;

				/* BACKGROUND LAYERS */
				if (!bgName) background = null;else if (bgName[0] === '#') background = bgName;else if (bgName in novel.images) background = novel.images[bgName];
				this.draw.background(ctx, background || '#FFF');

				/* CHARACTER LAYER */
				novel.cdata.characters.sort(function (a, b) {
					return a.priority - b.priority;
				}); //Move this to where we mutate cd.characters?
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = cd.characters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var char = _step.value;

						var charName = char.character;
						var imgName = characters[charName].images[char.mood];
						var img = novel.images[imgName];
						var x = null;
						var y = ctx.canvas.height - img.height;

						switch (char.position.toLowerCase()) {
							case 'left':
								x = ctx.canvas.width / 4 - img.width / 2;break;
							case 'right':
								x = ctx.canvas.width / 4 * 3 - img.width / 2;break;
							case 'middle': /* Falls through to default */
							default:
								x = ctx.canvas.width / 2 - img.width / 2;
						}
						ctx.drawImage(img, x, y, img.width, img.height);
					}

					/* FOREGROUND LAYERS */
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator['return']) {
							_iterator['return']();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				this.draw.dialogueBox(ctx, textbox, novel.images.textbox);
				//this.draw.speakerBox(ctx, textbox);

				var fontString = this.text.CSS_string(textbox.font.size, textbox.font.family, textbox.font.style, textbox.font.weight);
				ctx.fillStyle = textbox.font.color;
				ctx.textBaseline = 'top';
				ctx.font = fontString;

				var textToSay = cd.dialogue || '';
				var dialogue = cd.dialogueLines.slice(cd.startLine).slice(0, textbox.lines);
				this.draw.dialogueText(ctx, dialogue, textbox, textbox.lines);

				var name = cd.speaker || '';
				var speakerColor = cd.speakerColor || textbox.font.color;
				if (cd.speaker in novel.characters) name = novel.characters[cd.speaker].name, speakerColor = novel.characters[cd.speaker].color;
				this.draw.speakerText(ctx, name, textbox.speakerbox, speakerColor);

				rAF(function (timeframe) {
					return _this2.loop(timeframe);
				});
			}
		}]);

		return Visuals;
	})();

	exports.Visuals = Visuals;
	;

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * @fileoverview Methods used in {@link module:eVN/Visuals} for rendering text
	* @module eVN/Visuals/text
	 */

	/**Explodes <code>string</code> into an array of strings that won't exceed <code>maxWidth</code> when drawn on <code>ctx</code>
	 * @param {object} ctx - Context to probe .measureText() on
	 * @param {string} string - The string to split
	 * @param {number} fontSize - Font size of the context
	 * @param {number} maxWidth - The maximum width of a string in the returned array <i>(in pixels)</i>
	 * @param {bool} [doGuess=true] - Try estimating the line width using the font size and maxWidth propert
	 * @param {string[]} [output] - An argument used by the function when recursing when concatenating previous attempts
	 * @returns {string[]} An array containing slices of <code>string</code> with a maximum pixel width of <code>maxWidth</code> */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports.split = split;
	exports.CSS_string = CSS_string;

	function split(ctx, string, fontSize, maxWidth) {
		var doGuess = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];
		var output = arguments.length <= 5 || arguments[5] === undefined ? [] : arguments[5];

		doGuess = doGuess !== false;

		/* If the string contains a newline character, we'll split there and recurse */
		if (string.indexOf('\n') !== -1) {
			var newlineIndex = string.indexOf('\n');
			var alpha = string.slice(0, newlineIndex);
			var beta = string.slice(newlineIndex + 1);
			return this.split(ctx, alpha, fontSize, maxWidth).concat(this.split(ctx, beta, fontSize, maxWidth));
		}

		/* If the string already fits inside `maxWidth` or can't be split, we won't loop through it */
		if (ctx.measureText(string).width <= maxWidth) return [string];

		var words = string.split(' ');
		var probeFromIndex = words.length;

		if (doGuess) {
			/* Try guessing how many words to start probing with */
			var guessedLineLength = maxWidth / (fontSize / 2.5);
			var probeFromChar = string.indexOf(' ', guessedLineLength);
			probeFromIndex = string.slice(0, probeFromChar).split(' ').length;

			/* If the probe index is larger than the actual length of the words array, just start at the end of the array */
			if (probeFromIndex > words.length) probeFromIndex = words.length;
		}

		/* Loop backwards through the array of words, starting at the guessed length or from the end */
		for (var i = probeFromIndex; i >= 1; i--) {
			/* Split the array into two chunks and stringify them */
			var alpha = words.slice(0, i).join(' ');
			var beta = words.slice(i, words.length).join(' ');
			var width = ctx.measureText(alpha).width;

			/* If the first chunk fits inside `maxWidth` on the first loop, we guessed too low. Restart without guessing */
			if (doGuess && width < maxWidth && i === probeFromIndex) return this.split(ctx, string, fontSize, maxWidth, false);

			/* If the first chunk fits inside `maxWidth`, append it to the finished string.
	     If the second chunk is empty, return `output`, otherwise try again */
			if (width < maxWidth) {
				output.push(alpha);
				return beta ? output.concat(this.split(ctx, beta, fontSize, maxWidth)) : output;
			}
		}

		/* If the script hasn't returned by now, it wasn't able to split the first index of `words`.
	    Append it to the output and give the end-developer a warning, recursive if there are more words left. */
		eVN.logger.warn('Unable to split word "' + words[0] + '".')();
		output.push(words.shift());
		if (words.length >= 1) return output.concat(this.split(ctx, words.join(' '), fontSize, maxWidth));else return output;
	}

	;

	/**Generate a valid CSS font string
	 * @param {string} [size=18] - The font-size to use in pixels
	 * @param {string} [family=Comic Neue] - The font-family to use
	 * @param {string} [style=normal] - Text style ('normal', 'italic', 'oblique')
	 * @param {string} [weight=normal] - The weight to use (i.e. 'bold')
	 * @returns {string} valid CSS font property value */

	function CSS_string() {
		var size = arguments.length <= 0 || arguments[0] === undefined ? 18 : arguments[0];
		var family = arguments.length <= 1 || arguments[1] === undefined ? 'Comic Neue' : arguments[1];
		var style = arguments.length <= 2 || arguments[2] === undefined ? 'normal' : arguments[2];
		var weight = arguments.length <= 3 || arguments[3] === undefined ? 'normal' : arguments[3];

		family = family[0] === "'" ? family : family[0] === '"' ? family : "'" + family + "'";
		return style + ' ' + weight + ' ' + size + 'px ' + family;
	}

	;

/***/ },
/* 4 */
/***/ function(module, exports) {

	/** @fileoverview Hosts mosts drawing in {@link module:eVN/Visuals} */

	/**Draws a background on <code>context</code>
	 * @param {object} context - Rendering context to draw on
	 * @param {(string|object)} background - Can be either a color shorthand, HEX value, rgb(), rgba() or an <code>Image</code> */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports.background = background;
	exports.dialogueBox = dialogueBox;
	exports.speakerBox = speakerBox;
	exports.dialogueText = dialogueText;
	exports.speakerText = speakerText;

	function background(ctx, background) {
		if (background instanceof Image) {
			ctx.drawImage(background, 0, 0, ctx.canvas.width, ctx.canvas.height);
		} else {
			ctx.fillStyle = background;
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		}
	}

	;

	/**Draws the dialogue box
	 * @param {object} context - Rendering context to draw on
	 * @param {object} textboxOptions - The eVNML `textbox` option property
	 * @param {object} image - The img object to draw */

	function dialogueBox(ctx, textboxOptions, image) {
		if (image) {
			var x = 0;
			var y = ctx.canvas.height - image.height;
			var width = image.width;
			var height = image.height;
			ctx.drawImage(image, x, y, width, height);
		} else {
			var x = 0;
			var y = ctx.canvas.height - textboxOptions.speakerbox.bottom - 5;
			var width = ctx.canvas.width;
			var height = ctx.canvas.height;

			ctx.fillStyle = 'rgba(0, 0, 0, .35)';
			ctx.fillRect(x, y, width, height);
		}
	}

	;

	/**Draws the speaker box
	 * @param {object} context - Rendering context to draw on
	 * @param {object} textboxOptions - The eVNML `textbox` option property */

	function speakerBox(ctx, textboxOptions) {
		var speakerboxOptions = textboxOptions.speakerbox;
		var x = textboxOptions.left;
		var y = ctx.canvas.height - speakerboxOptions.bottom - speakerboxOptions.height;
		var width = speakerboxOptions.width;
		var height = speakerboxOptionsbox.height;

		ctx.fillStyle = speakerboxOptionsbox.color || textboxOptions.color;
		ctx.fillRect(x, y, width, height);
	}

	;

	/**Function intended for drawing dialogue / monologue (though it can be used for anything)
	 * @param {object} context - Rendering context to draw on
	 * @param {string[]} text - The array of lines to draw. See the <code>split</code> function
	 * @param {object} textboxOptions - Should be <code>eVNML.options.textbox</code>, object containing textbox properties
	 * @param {number} maxLines - Maximum amount of lines to draw at a time */

	function dialogueText(ctx, text, textboxOptions, maxLines) {
		var box = textboxOptions;

		var lineHeight = box.lineHeight;
		//var maxWidth = ctx.canvas.width - box.margin*2 - box.padding*2;
		//var x = box.margin + box.padding;
		//var y = ctx.canvas.height - box.height - box.bottom + box.padding;
		var maxWidth = box.maxWidth;
		var x = box.left;
		var y = ctx.canvas.height - box.bottom;
		maxLines = maxLines || 3;

		for (var i = 0, l = text.length; i < (l > maxLines ? maxLines : l); i++) {
			var lineY = y + lineHeight * i;
			ctx.fillText(text[i], x, lineY, maxWidth);
		}
	}

	;

	/**Draws the speakerbox text
	 * @param {object} context - Rendering context to draw on
	 * @param {string} string - String to draw
	 * @param {object} optionsSpeakerbox - Should be eVNML.textbox.speakerbox, used to determine where to put the text
	 * @param {string} [color] - Color to use */

	function speakerText(ctx, string, optionsSpeakerbox, color) {
		var sbox = optionsSpeakerbox;

		var x = sbox.left;
		var y = ctx.canvas.height - sbox.bottom;
		var maxWidth = sbox.maxWidth || ctx.canvas.width - x;

		ctx.fillStyle = color || ctx.fillStyle;
		ctx.fillText(string, x, y, maxWidth);
	}

	;

/***/ },
/* 5 */
/***/ function(module, exports) {

	/** A class for managing data related to novel characters */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Character = (function () {
		/** @param {object} eVNM_char - The eVNML data to instantiate from */

		function Character(eVNML_char) {
			_classCallCheck(this, Character);

			this.name = eVNML_char['first name'] || eVNML_char['name'];
			this.lname = eVNML_char['last name'] || null;
			this.color = eVNML_char['color'] || eVNML_char['colour'] || '#FFF';
			this.images = eVNML_char['images'] || {};
			this.mood = 'default';
		}

		_createClass(Character, [{
			key: 'cImage',
			get: function get() {
				return this.images[this.mood];
			}
		}]);

		return Character;
	})();

	exports.Character = Character;

/***/ },
/* 6 */
/***/ function(module, exports) {

	/** A class for managing scene instruction methods */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var SceneInstructor = (function () {
		/** @param {object} scope - Scope to bind instruction methods to */

		function SceneInstructor(scope) {
			_classCallCheck(this, SceneInstructor);

			/** Scope methods will be bound to */
			this.scope = scope;

			/* Aliases */
			this.get = this.getMethod;
		}

		_createClass(SceneInstructor, [{
			key: 'getMethod',
			value: function getMethod(method, args) {
				var meth = this[method];
				if (meth instanceof Function) {
					return meth.bind.apply(meth, [this.scope].concat(_toConsumableArray(args)));
				} else return null;
			}

			/** Sets the background of a scene. Skips to the next scene. */
		}, {
			key: 'background',
			value: function background(_background) {
				this.cdata.background = _background;return false;
			}

			/** Changes the background music. Skips to the next scene. */
		}, {
			key: 'music',
			value: function music(track) {
				if (track in this.audio) this.audio[track].play();return false;
			}

			/**Changes the contents of the dialogue & speaker box. Does NOT skip to the next scene.
	   * @param {string} text - Dialogue to say
	   * @param {string} [speaker=null] - The person talking -Improve this-
	   * @param {string} [speakerColor='#FFF'] - #HEX or rgb() color of the speaker's name */
		}, {
			key: 'say',
			value: function say(text) {
				var speaker = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
				var speakerColor = arguments.length <= 2 || arguments[2] === undefined ? '#FFF' : arguments[2];

				var cd = this.cdata;
				var textbox = this.eVNML.options.textbox;
				/*Process inline variables for text*/
				text = this.processVariables(text);

				if (speaker !== null) {
					cd.speaker = speaker;
					cd.dialogue = '"' + text + '"';
					cd.speakerColor = speakerColor;
				} else cd.dialogue = text;

				var maxWidth = textbox.maxWidth;
				cd.dialogueLines = this.visuals.text.split(this.context, cd.dialogue, textbox.font.size, maxWidth);
				cd.startLine = 0;
				return true;
			}
		}]);

		return SceneInstructor;
	})();

	exports.SceneInstructor = SceneInstructor;

/***/ },
/* 7 */
/***/ function(module, exports) {

	/**A logging class, covering debug logs, warnings & errors
	 * IMPORTANT: Each method returns a <code>function</code>!
	 * Use like so:
	 * @example
	 * var logger = new Logger('myLog', 'v0.5b', false);
	 * logger.warn('Something may be wrong!')(); */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
		value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Logger = (function () {
		/**@param {string} [name='UnnamedLogger'] - The name of the logger. Will show up in logs.
	  * @param {string} [version=NaN] - Version parameter, will show up in logs.
	  * @param {bool} [verbose=true] - Whether or not to skip non warn/error logs. */

		function Logger() {
			var name = arguments.length <= 0 || arguments[0] === undefined ? 'Unnamedlogger' : arguments[0];
			var version = arguments.length <= 1 || arguments[1] === undefined ? 'NaN' : arguments[1];
			var verbose = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

			_classCallCheck(this, Logger);

			/** @ignore */
			this.name = name;
			/** @ignore */
			this.version = version;
			/** @ignore */
			this.verbose = verbose;

			/** @ignore */
			this.logName = this.name + ' v' + this.version;
			/** @ignore */
			this.logPrefix = '[' + this.logName + ' INFO]';
			/** @ignore */
			this.warnPrefix = '[' + this.logName + ' WARN]';
			/** @ignore */
			this.errPrefix = '[' + this.logName + ' ERR]';
		}

		/**A method for logging non-critical information.
	  * @param {*} message - Message to log.
	  * @returns {Function} - <code>console.log</code> binded with the
	  * appropriate scope & arguments */

		_createClass(Logger, [{
			key: 'log',
			value: function log() {
				var _console$log;

				var logMsg = [this.logPrefix];

				for (var _len = arguments.length, msgs = Array(_len), _key = 0; _key < _len; _key++) {
					msgs[_key] = arguments[_key];
				}

				if (msgs.length < 1 || !this.verbose) return function () {};

				if (msgs.length === 1 && typeof msgs[0] === 'string') logMsg[0] += ' ' + msgs[0];else logMsg = [logMsg[0]].concat(msgs);

				if (console && console.log) return (_console$log = console.log).bind.apply(_console$log, [console].concat(_toConsumableArray(logMsg)));
			}

			/**A method for logging warnings.
	   * @param {*} message - Message to log.
	   * @returns {Function} - <code>console.warn</code> binded with the
	   * appropriate scope & arguments */
		}, {
			key: 'warn',
			value: function warn() {
				var _console$warn;

				var logMsg = [this.warnPrefix];

				for (var _len2 = arguments.length, msgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					msgs[_key2] = arguments[_key2];
				}

				if (msgs.length < 1) return function () {};

				if (msgs.length === 1 && typeof msgs[0] === 'string') logMsg[0] += ' ' + msgs[0];else logMsg = [logMsg[0]].concat(msgs);

				if (console && console.warn) return (_console$warn = console.warn).bind.apply(_console$warn, [console].concat(_toConsumableArray(logMsg)));
			}

			/**A method for throwing errors.
	   * @param {string|Error} error - Name/Type/Error to throw.
	   * @param {string} [message='UnknownError'] - Message to log. If
	   * <code>error instanceof Error</code> is true,
	   * <code>error.stack</code> will be used.
	   * @returns {Function} - <code>throw</code> and <code>console.error</code>
	   * binded with the appropriate scope & arguments */
		}, {
			key: 'throw',
			value: function _throw(error, message) {
				var _this = this;

				if (error === undefined) error = 'UnknownError';

				var eErr;

				if (error instanceof Error) eErr = error;else {
					eErr = new Error(error);if (message) eErr.stack = message;
				};

				eErr.name = this.errPrefix + ' ' + eErr.name;

				return function () {
					if (console && console.error) {
						if (message) console.error(_this.errPrefix + ' ' + eErr.message);
						console.error(eErr.stack);
						throw _this.logName + ' halted';
					} else throw eErr;
				};
			}
		}]);

		return Logger;
	})();

	exports.Logger = Logger;
	;

/***/ }
/******/ ]);