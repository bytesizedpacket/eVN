/** @fileoverview Hosts mosts drawing in {@link module:eVN/Visuals} */

/**Draws a background on <code>context</code>
 * @param {object} context - Rendering context to draw on
 * @param {(string|object)} background - Can be either a color shorthand, HEX value, rgb(), rgba() or an <code>Image</code> */
export function background(ctx, background) {
	if(background instanceof Image) {
		ctx.drawImage(background, 0, 0, ctx.canvas.width, ctx.canvas.height);
	} else {
		ctx.fillStyle = background;
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}
};

/**Draws the dialogue box
 * @param {object} context - Rendering context to draw on
 * @param {object} textboxOptions - The eVNML `textbox` option property
 * @param {object} image - The img object to draw */
export function dialogueBox(ctx, textboxOptions, image) {
	if(image) {
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
};

/**Draws the speaker box
 * @param {object} context - Rendering context to draw on
 * @param {object} textboxOptions - The eVNML `textbox` option property */
export function speakerBox(ctx, textboxOptions) {
		var speakerboxOptions = textboxOptions.speakerbox;
		var x = textboxOptions.left;
		var y = ctx.canvas.height - speakerboxOptions.bottom - speakerboxOptions.height;
		var width = speakerboxOptions.width;
		var height = speakerboxOptionsbox.height;

		ctx.fillStyle = speakerboxOptionsbox.color || textboxOptions.color;
		ctx.fillRect(x, y, width, height);
};

/**Function intended for drawing dialogue / monologue (though it can be used for anything)
 * @param {object} context - Rendering context to draw on
 * @param {string[]} text - The array of lines to draw <i>see: {@link eVN.NovelClass.VisualsClass.splitText})
 * @param {object} textboxOptions - Should be <code>eVNML.options.textbox</code>, object containing textbox properties
 * @param {number} maxLines - Maximum amount of lines to draw at a time */
export function dialogueText(ctx, text, textboxOptions, maxLines) {
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

/**Draws the speakerbox text
 * @param {object} context - Rendering context to draw on
 * @param {string} string - String to draw
 * @param {object} optionsSpeakerbox - Should be eVNML.textbox.speakerbox, used to determine where to put the text
 * @param {string} [color] - Color to use */
export function speakerText(ctx, string, optionsSpeakerbox, color) {
	var sbox = optionsSpeakerbox;

	var x = sbox.left;
	var y = ctx.canvas.height - sbox.bottom;
	var maxWidth = sbox.maxWidth || ctx.canvas.width - x;

	ctx.fillStyle = color || ctx.fillStyle;
	ctx.fillText(string, x, y, maxWidth);
};
