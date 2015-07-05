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
