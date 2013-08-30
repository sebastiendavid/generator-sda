var express = require('express'),
    app = express(),
    fs = require('fs'),
    less = require('less'),
    pkg = JSON.parse(fs.readFileSync(__dirname + '/package.json'));

app.set('env', 'development');
app.set('serverPort', pkg.serverPort);

process.argv.forEach(function (val) {
    if (val === 'prod' || val === 'express:prod') {
        app.set('env', 'production');
    } else if (val.indexOf('port=') > -1) {
        try {
            var split = val.split('=');
            if (split.length === 2) {
                app.set('serverPort', parseInt(split[1]));
            }
        } catch (e) {
            console.log('warn: cannot parse server port');
        }
    }
});

app.configure('development', function () {

    app.use(express.logger({ format: ':method :url' }));
    app.use(express.static(__dirname + '/app'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

    app.set('view engine', 'jade');
    app.engine('jade', require('jade').__express);
    app.locals.pretty = true;

    app.get('/css/main.css', function (req, res) {

        var lessParser = new (less.Parser)({
            paths: [__dirname + '/app/styles'],
            filename: 'style.less'
        });

        lessParser.parse(fs.readFileSync(__dirname + '/app/styles/main.less', 'utf8'), function (err, tree) {
            res.set('Content-Type', 'text/css');
            if (err) {
                console.error('cannot parse LESS file');
                res.send();
            } else {
                res.send(tree.toCSS({
                    compress: false,
                    yuicompress: false
                }));
            }
        });
    });

    app.get('/', function (req, res) {
        res.redirect('/index.html');
    });

    app.get('/index.html', function (req, res) {
        res.set('Content-Type', 'text/html');
        res.render(__dirname + '/app/templates/index.jade', {
            env: app.get('env')
        });
    });

    app.get('/conf/deps.js', function (req, res) {
        res.set('Content-Type', 'text/javascript');
        var conf = JSON.parse(fs.readFileSync(__dirname + '/app/conf/deps.json'));
        conf.baseUrl = './';
        res.send('window.requireJsConf = ' + JSON.stringify(conf) + ';');
    });
});

app.configure('production', function () {

    app.use(express.logger({ format: ':method :url' }));
    app.use(express.static(__dirname + '/dist'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

    app.set('view engine', 'jade');
    app.engine('jade', require('jade').__express);
    app.locals.pretty = true;

    app.get('/', function (req, res) {
        res.redirect('/index.html');
    });

    app.get('/index.html', function (req, res) {
        res.set('Content-Type', 'text/html');
        res.render(__dirname + '/app/templates/index.jade', {
            env: 'production',
            version: pkg.version,
            min: req.query.beautify === 'true' ? '' : '.min'
        });
    });
});

app.listen(app.get('serverPort'));

console.log("Welcome to " + pkg.name + " " + pkg.version);
console.log("NodeJS server is listenning to port " + app.get('serverPort'));
