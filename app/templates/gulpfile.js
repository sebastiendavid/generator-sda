'use strict';
var _ = require('lodash');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var connect = require('connect');
var connectLivereload = require('connect-livereload');
var del = require('del');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var http = require('http');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var minifyCSS = require('gulp-minify-css');
var morgan = require('morgan');
var portscanner = require('portscanner');
var q = require('q');
var serveStatic = require('serve-static');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var yargs = require('yargs').argv;
var zip = require('gulp-zip');

var minify = !!yargs.minify;
var server;
var port;

var handleError = function (err) {
    console.error(err.message);
    this.emit('end');
};

gulp.task('server', ['connect']);
gulp.task('build', ['less', 'browserify', 'html']);

gulp.task('connect', ['find:port', 'watch'], function () {
    var app = connect()
        .use(morgan('dev'))
        .use(connectLivereload())
        .use(serveStatic('bower_components'))
        .use(serveStatic('dist'));
    server = http.createServer(app).listen(port);
    console.info('server is listening to ' + port);
});

gulp.task('find:port', ['server:stop'], function () {
    if (!_.isNumber(port) || port < 1) {
        var deferred = q.defer();
        portscanner.findAPortNotInUse(8000, 8999, '127.0.0.1', function (error, found) {
            if (error) {
                deferred.reject(error);
            } else {
                console.info('port found: ' + found);
                port = found;
                deferred.resolve();
            }
        });
        return deferred.promise;
    }
});

gulp.task('server:stop', function () {
    if (server && _.isFunction(server.close)) {
        var deferred = q.defer();
        console.info('server is closing');
        server.close(function () {
            console.info('server is closed');
            deferred.resolve();
        });
        return deferred.promise;
    }
});

gulp.task('watch', ['build'], function () {
    var timer;
    var lrl = function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = _.delay(function () {
            livereload.changed();
            timer = null;
        }, 800);
    };

    livereload.listen();

    gulp.watch('src/index.html', ['html']);
    gulp.watch('src/js/**/*.js', ['browserify']);
    gulp.watch('src/less/**/*.less', ['less']);

    gulp.watch('dist/index.html').on('change', lrl);
    gulp.watch('dist/js/**/*.js').on('change', lrl);
    gulp.watch('dist/css/**/*.css').on('change', lrl);
});

gulp.task('html', function () {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('browserify', function () {
    return browserify('./src/js/index.js', {
            standalone: 'sda.<%= projectName %>'
        })
        .bundle()
        .on('error', handleError)
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(gulpif(minify, uglify()))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('less', function () {
    gulp.src('src/less/**/*.less')
        .pipe(less({
            paths: ['bower_components']
        }))
        .on('error', handleError)
        .pipe(gulpif(minify, minifyCSS()))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('clean', function () {
    var deferred = q.defer();
    del(['dist'], function () {
        deferred.resolve();
    });
    return deferred.promise;
});

gulp.task('zip', ['build'], function () {
    return gulp.src([
            'dist/index.html',
            'dist/js/**/*.js',
            'dist/css/**/*.css',
        ], {
            base: 'dist'
        })
        .pipe(zip('<%= projectName %>.zip'))
        .pipe(gulp.dest('dist'));
});
