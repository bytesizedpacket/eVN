module.exports = {
	javascript: {
		files: {
			'dist/eVN.min.js': ['dist/eVN.js']
		}
	},
	nomangle: {
		options: {
			mangle: false,
			compress: true,
			mangleProperties: false,
			reserveDOMProperties: true,
			reserveDOMCache: true
		},
		files: {
			'dist/eVN.min.js': ['dist/eVN.js']
		}
	}
};
