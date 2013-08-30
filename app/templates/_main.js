if (window.requireJsConf) {
    requirejs.config(window.requireJsConf);
}

require(['backbone', 'backbone-marionette', 'handlebars', 'jquery', 'knockback', 'knockout', 'moment', 'underscore'],
    function () {

        var queryParam = function (param) {
            var name = param.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]'),
                regexS = '[\\?&]' + name + '=([^&#]*)',
                regex = new RegExp(regexS),
                results = regex.exec(window.location.search);
            if (results == null) {
                return '';
            } else {
                return decodeURIComponent(results[1].replace(/\+/g, ' '));
            }
        };

        window.logenabled = queryParam('logenabled') === 'true';

        window.log = function (text, fileName) {
            if (window.logenabled) {
                console.log(moment().format('MMMM Do YYYY, h:mm:ss a, ') +
                    (fileName ? fileName + ': ' : '') + text);
            }
        };

        require(['<%= _.slugify(modulePrefix) %>-app'], function (App) {
            new App().start();
        });
    }
);