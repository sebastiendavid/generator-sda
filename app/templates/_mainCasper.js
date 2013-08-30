'use strict';

var casper = require('casper').create({
        pageSettings: {
            loadPlugins: true
        }
    }),
    timeout = 5000;

casper.test.begin('<%= _.slugify(modulePrefix) %> main tests', function (test) {
    casper.start('http://localhost:5555/index.html', function () {
        this.echo('server started');
    });

    // should body to be not empty
    casper.then(function () {
        test.assertExists('#header');
        test.assertExists('#content');
    });

    casper.run(function () {
        test.done();
        test.renderResults(true, 0, 'dist/casper-results-main.xml');
    });
});
