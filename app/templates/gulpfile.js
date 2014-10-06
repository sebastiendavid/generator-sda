
'use strict';
var _ = require('lodash');
var Q = require('q');
var gulp = require('gulp');
var connect = require('connect');
var http = require('http');
var morgan = require('morgan');
var serveStatic = require('serve-static');
var portscanner = require('portscanner');
var connectLivereload = require('connect-livereload');
var livereload = require('gulp-livereload');
var server;
var port;

gulp.task('server', ['connect']);

gulp.task('connect', ['find:port', 'watch'], function () {
    var app = connect()
        .use(morgan('dev'))
        .use(connectLivereload())
        .use(serveStatic('src'))
        .use(serveStatic('bower_components'));
    server = http.createServer(app).listen(port);
    console.info('server is listening to ' + port);
});

gulp.task('find:port', ['server:stop'], function () {
    if (!_.isNumber(port) || port < 1) {
        var deferred = Q.defer();
        portscanner.findAPortNotInUse(8000, 8999, '127.0.0.1', function (error, found) {
            if (error) {
                console.error(JSON.stringify(error));
                deferred.reject();
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
        var deferred = Q.defer();
        console.info('server is closing');
        server.close(function () {
            console.info('server is closed');
            deferred.resolve();
        });
        return deferred.promise;
    }
});

gulp.task('watch', function () {
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
    gulp.watch('src/**/*').on('change', lrl);
});
