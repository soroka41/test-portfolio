var gulp = require('gulp'),
	gutil = require('gulp-util'),
	sass = require('gulp-sass'),
	pug = require('gulp-pug'),
	plumber = require('gulp-plumber'),
	browsersync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	cleancss = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	notify = require('gulp-notify'),
	pkg  = require('./package.json'),
	rsync = require('gulp-rsync');

	//brouser-sync
gulp.task('browser-sync', function() {
	browsersync({
		// закомитить при proxy
		// server: {
		// 	baseDir: 'app'
		// },
		// для теста PHP (OpenServer)
		proxy: 'crud-table.loc:82',
		notify: false,
		// open: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	})
});

//sass
gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browsersync.reload( {stream: true} ))
});

//js
gulp.task('js', function() {
	return (gulp
			.src([
				'app/libs/jquery/dist/jquery.min.js',
				'app/libs/bootstrap/dist/js/bootstrap.js',
				'app/libs/bootstrap-validator/js/validator.js',
				'app/libs/twbs-pagination/jquery.twbsPagination.js',
				'app/libs/toastr/toastr.js',
				'app/js/common.js' // Always at the end
			])
			.pipe(concat('scripts.min.js'))
			// .pipe(uglify()) // Mifify js (opt.)
			.pipe(gulp.dest('app/js'))
			.pipe(browsersync.reload({ stream: true })) );
});

//pug(jade)
gulp.task('pug', function() {
	//pages rus
	var indexFile = gulp.src('app/pug/pages/*.pug')
		//-gulp auto restart
		.pipe(plumber({
			errorHandler: notify.onError()
		}))
		//
		.pipe(pug())
		.pipe(gulp.dest('app'));
	var indexFile = gulp.src('app/pug/pages/table/*.pug')
		//-gulp auto restart
		.pipe(plumber({
			errorHandler: notify.onError()
		}))
		//
		.pipe(pug())
		.pipe(gulp.dest('app/table'));

});

//deploy
gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

//watch
gulp.task('watch', ['sass', 'js', 'pug', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/pug/**/*.pug', ['pug']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/*.html', browsersync.reload)
});

//default
gulp.task('default', ['watch']);
