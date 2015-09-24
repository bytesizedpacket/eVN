var logger = null;
import * as text from './Visuals/text.js';
import * as draw from './Visuals/draw.js';
var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback) {setTimeout(callback, 1000/60);};

/** Class to manage and carry out drawing on a canvas */
export class Visuals {
	/** @param {Novel} novelInstance - Novel to pull data from */
	constructor(novelInstance) {
		logger = eVN.logger;
		/** Reference to the novel we are drawing */
		this.novel = novelInstance;
		/** The rendering context for this novel */
		this.ctx = novelInstance.context;

		// Temporary. remove this. These are pulled from text/draw.js -
		// should be rewritten.
		/** @ignore */
		this.draw = draw;
		/** @ignore */
		this.text = text;

		rAF(timeframe=> this.loop(timeframe));
	}

	/** Assembles graphics and exports to {@link Novel#outContext}, then calls itself in a timeout */
	loop(frametime) {
		var novel = this.novel;
		var ctx = novel.context;
		var cd = novel.cdata;

		var textbox = novel.eVNML.options.textbox;
		var bgName = cd.background;
		var background = null;
		var characters = novel.characters;

		/* BACKGROUND LAYERS */
		if(!bgName) background = null;
		else if(bgName[0] === '#') background = bgName;
		else if(bgName in novel.images) background = novel.images[bgName];
		this.draw.background(ctx, background || '#FFF');
		
		/* CHARACTER LAYER */
		novel.cdata.characters.sort( (a, b)=> a.priority - b.priority ); //Move this to where we mutate cd.characters?
		for(let char of cd.characters) {
			var charName = char.character;
			var imgName = characters[charName].images[char.mood ];
			var img = novel.images[imgName];
			var x = null;
			var y = ctx.canvas.height - img.height;
			
			switch( char.position.toLowerCase() ) {
				case 'left': x = ctx.canvas.width/4 - img.width/2; break;
				case 'right': x = ctx.canvas.width/4*3 - img.width/2; break;
				case 'middle': /* Falls through to default */
				default: x = ctx.canvas.width/2 - img.width/2;
			}
			ctx.drawImage(img, x, y, img.width, img.height);
		}

		/* FOREGROUND LAYERS */
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
		if(cd.speaker in novel.characters) name = novel.characters[cd.speaker].name, speakerColor = novel.characters[cd.speaker].color;
		this.draw.speakerText(ctx, name, textbox.speakerbox, speakerColor);

		rAF(timeframe=> this.loop(timeframe));
	}
};
