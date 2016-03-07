var gulp = require('gulp'),
	gutil = require('gulp-util'),
	coffee = require('gulp-coffee'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sass = require('gulp-ruby-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	scripts = 'src/*.coffee',
	styles = 'src/*.scss';

gulp.task('default', function () {
});

gulp.task('styles', function () {
	return sass(styles, {compass: true})
		.pipe(autoprefixer({cascade: false}))
		.pipe(gulp.dest('build/css'));
});

gulp.task('styles-min', function () {
	return sass(styles, {compass: true, style: 'compressed'})
		.pipe(rename({extname: '.min.css'}))
		.pipe(gulp.dest('build/css'));
});

gulp.task('scripts', function () {
	return gulp.src(scripts)
		.pipe(sourcemaps.init())
		.pipe(coffee({bare: true}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/js'));
});

gulp.task('scripts-min', function () {
	return gulp.src(scripts)
		.pipe(coffee({bare: true}))
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/js'));
});

gulp.task('scripts-concat', function () {
	return gulp.src(scripts)
		.pipe(coffee({bare: true}))
		.pipe(sourcemaps.init())
		.pipe(concat('TableTableForm.js'))
		.pipe(gulp.dest('build/js'))
		.pipe(uglify())
		.pipe(rename({extname: '.min.js'}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('build/js'));
});

gulp.task('build', ['scripts', 'scripts-min', 'styles', 'styles-min', 'scripts-concat']);

gulp.task('watch', function () {
	gulp.watch(styles, ['styles']);
	gulp.watch(scripts, ['scripts']);
});