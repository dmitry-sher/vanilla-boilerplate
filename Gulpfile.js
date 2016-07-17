var gulp = require('gulp'),
	sass = require('gulp-sass'),
	neat = require('node-neat').includePaths,
	minifycss = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	watch = require('gulp-watch');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var clean = require('gulp-clean');

var buildParams = {
	appStyles: 'css',
	appImg: 'img',
	appFonts: 'fonts',
	appScripts: 'scripts',
	appFav: 'fav',
	buildDir: 'dist',
	buildStyles: 'dist/css',
	buildImg: 'dist/img',
	buildFonts: 'dist/fonts',
	buildScripts: 'dist/scripts',
	buildFav: 'dist/'
}

gulp.task('copyFav', function() {
	gulp
		.src(buildParams.appFav + "/*")
		.pipe(gulp.dest(buildParams.buildFav));
});

gulp.task('copyStyles', function() {
	gulp
		.src(buildParams.appStyles + "/*")
		.pipe(gulp.dest(buildParams.buildStyles));
});

gulp.task('copyFonts', function() {
	gulp
		.src(buildParams.appFonts + "/*")
		.pipe(gulp.dest(buildParams.buildFonts));
});

gulp.task('copyImg', function() {
	gulp
		.src(buildParams.appImg + "/*")
		.pipe(gulp.dest(buildParams.buildImg));

	gulp
		.src(buildParams.appImg + "/*/*")
		.pipe(gulp.dest(buildParams.buildImg));

	gulp
		.src(buildParams.appImg + "/*/*/*")
		.pipe(gulp.dest(buildParams.buildImg));
});

gulp.task('copyScripts', function() {
	gulp
		.src(buildParams.appScripts + "/*")
		.pipe(gulp.dest(buildParams.buildScripts));
});

gulp.task('copyHtml', function() {
	gulp
		.src("*.html")
		.pipe(gulp.dest(buildParams.buildDir));
});


gulp.task('cleanUp', function() {
	return gulp
		.src(buildParams.buildDir + '/*', {read: false})
		.pipe(clean());
});




gulp.task('build', ['cleanUp', 'sass', 'copyStyles', 'copyImg', 'copyScripts', 'copyFonts', 'copyHtml', 'copyFav'], function() {
});

gulp.task('serve', ['sass'], function() {

	browserSync.init({
		server: "./"
	});

	gulp.watch("scss/*.scss", ['sass']).on('change', reload);
	gulp.watch("*.html").on('change', reload);
});

gulp.task('sass', function() {
	return gulp.src('scss/*.scss')
		.pipe(sass({
			includePaths: ['styles'].concat(neat)
		}))
		.pipe(gulp.dest('css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('css'));
});

gulp.task('watch', function() {
	gulp.watch('scss/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'watch']);

