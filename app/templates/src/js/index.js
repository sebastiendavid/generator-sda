'use strict';
var $ = require('jquery');
var _ = require('lodash');
var angular = require('angular');

console.info('jquery ' + ($ ? '' : 'not ') + 'loaded');
console.info('lodash ' + (_ ? '' : 'not ') + 'loaded');
console.info('angular ' + (angular ? '' : 'not ') + 'loaded');
