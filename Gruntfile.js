module.exports = function(grunt) {

	grunt.initConfig({
		browserify: {
			javascript: {
				files: { 'dist/eVN.js': ['src/**/*.js'] }
			}
		},

		clean: {
			docs: ['doc']
		},

		jsdoc: {
			generate: {
				src: ['src/**/*.js', 'src/README.md'],
				options: { destination: 'doc' }
			}
		},

		jshint: {
			options: {
				curly: false, //Allow "if(condition) do();"
				eqeqeq: true, //Disallow == and !=
				eqnull: true, //Supress ===null warnings
				browser: true, //Our .js file is for browsers
				sub: true, //Supress warnings when using the [] notation
				"-W004": true, //Supress "{a} is already defined - TO BE FIXED
				"-W086": true //Allow switch() fall-through
			},

			validate: {
				src: ['src/**/*.js']
			}
		},

		uglify: {
			javascript: {
				files: { 'dist/eVN.min.js': ['dist/eVN.js'] }
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-newer');

	grunt.registerTask('default', ['newer:jshint:validate', 'newer:browserify:javascript', 'newer:uglify:javascript']);
	grunt.registerTask('docs', ['clean:docs', 'jsdoc:generate']);
	grunt.registerTask('hint', ['jshint:validate']);
	grunt.registerTask('nocache', ['jshint:validate', 'browserify:javascript', 'uglify:javascript']);
};
