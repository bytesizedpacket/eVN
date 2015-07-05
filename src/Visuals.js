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
