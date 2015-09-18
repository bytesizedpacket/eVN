const gp = require('gulp-load-plugins')({
	pattern: ['gulp-*'],
	replaceString: /^gulp-/,
	camelize: true,
	lazy: true
});

const WEBPACK_OPTS = {
	target: 'web',
	output: { filename: 'eVN.js' },
	module: {
		loaders: [ { loader: 'babel-loader?compact=false' } ],
		cache: true
	}
};

const UGLIFY_OPTS = {
	preserveComments: 'some'
};

const DIST_PATH = './';
const SRC_PATH = 'src/';



var fs = require('fs');
var gulp = require('gulp');

gulp.task('build', ()=> {
	return gulp.src(SRC_PATH +'/Main.js')
		.pipe( gp.webpack(WEBPACK_OPTS) )
		.pipe( gulp.dest(DIST_PATH) )
		.pipe( gp.uglify(UGLIFY_OPTS) )
		.pipe( gp.rename({extname: '.min.js'}) )
		.pipe( gulp.dest(DIST_PATH) );
});

gulp.task('watch', ()=> {
	gulp.watch(SRC_PATH +'/**', ['build']);
});
