'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserify = require('gulp-browserify'),
    mocha = require('gulp-mocha');

function handleErr(err) {
    /* jshint validthis:true */
    console.log(err.toString());
    this.emit('end');
}

gulp.task('lint', function() {
    return gulp.src([
            'gulpfile.js',
            'src/**/*.js'
        ])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));
});

gulp.task('lint-tests', function() {
    return gulp.src('test/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));
});

gulp.task('post-lint', function() {
    return gulp.src('dist/typing-detector.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'));
});

gulp.task('test', ['build'], function() {
    return gulp.src('test/**/*.js')
        .pipe(mocha({ reporter: 'list' }))
        .on('error', handleErr);
});

gulp.task('build', ['lint'], function() {
    return gulp.src('src/browser.js')
        .pipe(browserify())
        .pipe(rename(function (path) {
            path.basename = 'typing-detector';
        }))
        .pipe(gulp.dest('./dist'))

        // Minify
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))

        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['test'], function() {
    // Tests
    gulp.watch('test/**/*.js', ['test']);

    // Linting Tasks
    gulp.watch('**/*.js', ['lint']);

    // Building Tasks
    gulp.watch('src/**/*.js', ['build']);
});

gulp.task('default', ['watch']);
