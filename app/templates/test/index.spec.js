/* jshint expr: true */
/* global describe: false, it: false, before: false */
'use strict';
describe('mainModule.spec.js', function () {
    var $;
    var _;
    var angular;
    var index;
    var proxyquire;
    var sinon;

    before(function () {
        require('should');

        proxyquire = require('proxyquire');
        sinon = require('sinon');

        sinon.spy(console, 'info');

        $ = {
            '@noCallThru': true
        };

        _ = {
            '@noCallThru': true
        };

        angular = {
            '@noCallThru': true
        };

        index = proxyquire('../src/js/index.js', {
            jquery: $,
            lodash: _,
            angular: angular
        });
    });

    it('index module should log', function () {
        // then
        console.info.callCount.should.be.exactly(3);
    });
});
