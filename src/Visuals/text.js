/**
 * @fileoverview Methods used in {@link module:eVN/Visuals} for rendering text
* @module eVN/Visuals/text
 */

/**Explodes <code>string</code> into an array of strings that won't exceed <code>maxWidth</code> when drawn on <code>context</code>
 * @param {object} ctx - Context to probe .measureText() on
 * @param {string} string - The string to split
 * @param {number} fontSize - Font size of the context
 * @param {number} maxWidth - The maximum width of a string in the returned array <i>(in pixels)</i>
 * @param {bool} [doGuess=true] - Try estimating the line width using the font size and maxWidth propert
 * @param {string[]} [output] - An argument used by the function when recursing when concatenating previous attempts
 * @returns {string[]} An array containing slices of <code>string</code> with a maximum pixel width of <code>maxWidth</code> */
export function split(ctx, string, fontSize, maxWidth, doGuess=true, output=[]) {
	doGuess = doGuess !== false;

	/* If the string contains a newline character, we'll split there and recurse */
	if(string.indexOf('\n') !== -1) {
		var newlineIndex = string.indexOf('\n');
		var alpha = string.slice(0, newlineIndex);
		var beta = string.slice(newlineIndex+1);
		return this.split(ctx, alpha, fontSize, maxWidth).concat(this.split(ctx, beta, fontSize, maxWidth));
	}

	/* If the string already fits inside `maxWidth` or can't be split, we won't loop through it */
	if(ctx.measureText(string).width <= maxWidth) return [string];

	var words = string.split(' ');
	var probeFromIndex = words.length;

	if(doGuess) {
		/* Try guessing how many words to start probing with */
		var guessedLineLength = maxWidth / (fontSize /2.5);
		var probeFromChar = string.indexOf(' ', guessedLineLength);
		probeFromIndex = string.slice(0, probeFromChar).split(' ').length;

		/* If the probe index is larger than the actual length of the words array, just start at the end of the array */
		if(probeFromIndex > words.length) probeFromIndex = words.length;
	}

	/* Loop backwards through the array of words, starting at the guessed length or from the end */
	for(var i=probeFromIndex; i>=1; i--) {
		/* Split the array into two chunks and stringify them */
		var alpha = words.slice(0, i).join(' ');
		var beta = words.slice(i, words.length).join(' ');

		var width = ctx.measureText(alpha).width;

		/* If the first chunk fits inside `maxWidth` on the first loop, we guessed too low. Restart without guessing */
		if(doGuess && width < maxWidth && i === probeFromIndex) return this.split(ctx, string, fontSize, maxWidth, false);

		/* If the first chunk fits inside `maxWidth`, append it to the finished string.
		   If the second chunk is empty, return `output`, otherwise try again */
		if(width < maxWidth) {
			output.push(alpha);
			return beta? output.concat( this.split(ctx, beta, fontSize, maxWidth) ) : output;
		}
	}

	/* If the script hasn't returned by now, it wasn't able to split the first index of `words`.
	   Append it to the output and give the end-developer a warning, recursive if there are more words left. */
	eVN.logger.warn('Unable to split word "'+ words[0] +'".')();
	output.push(words.shift());
	if(words.length >= 1) return output.concat(this.split(ctx, words.join(' '), fontSize, maxWidth));
	else return output;
};

/**Generate a valid CSS font string
 * @param {string} [size=18] - The font-size to use in pixels
 * @param {string} [family=Comic Neue] - The font-family to use
 * @param {string} [style=normal] - Text style ('normal', 'italic', 'oblique')
 * @param {string} [weight=normal] - The weight to use (i.e. 'bold')
 * @returns {string} valid CSS font property value */
export function CSS_string(size=18, family='Comic Neue', style='normal', weight='normal') {
	family = family[0]==="'"? family : family[0]==='"'? family : "'"+family+"'";
	return style +' '+ weight +' '+ size+'px '+ family;
};
