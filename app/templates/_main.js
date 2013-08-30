if (requirejs && typeof requirejs.config === 'function' && window.requireJsConf) {
    requirejs.config(window.requireJsConf);
}

require(['moment', '<%= _.slugify(modulePrefix) %>-app'], function (moment, App) {
    'use strict';

    var queryParam = function (param) {
        var name = param.replace(/[\[]/, '\\[').replace(/[\\]]/, '\\]'),
            regexS = '[\\?&]' + name + '=([^&#]*)',
            regex = new RegExp(regexS),
            results = regex.exec(window.location.search);
        if (results === null) {
            return '';
        } else {
            return decodeURIComponent(results[1].replace(/\+/g, ' '));
        }
    };

    var logenabled = queryParam('logenabled') === 'true';

    window.log = function (text, fileName) {
        if (logenabled) {
            console.log(moment().format('MMMM Do YYYY, h:mm:ss a, ') +
                (fileName ? fileName + ': ' : '') + text);
        }
    };

    new App().start();
});