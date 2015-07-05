module.exports = {
	options: {
		curly: false,
		eqeqeq: true,
		eqnull: true,
		browser: true,
		sub: true,
		shadow: true, //Supress "already defined" warnings
		"-W086": true //allow switch fall-through
	},

	validate: {
		src: ['src/**//*.js']
	}
};
