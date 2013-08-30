define(['backbone', 'marionette', 'underscore', '<%= _.slugify(modulePrefix) %>-router', '<%= _.slugify(modulePrefix) %>-main-view'],
    function (Backbone, Marionette, _, Router, MainView) {
        return Marionette.Application.extend({

            onInitializeAfter: function () {
                log('app initialize:after');

                Marionette.Renderer.render = function (template, data) {
                    if (_.isFunction(template)) {
                        return template(data);
                    } else if (_.isString(template)) {
                        return template;
                    } else {
                        return template + '';
                    }
                };

                this.addRegions({
                    mainRegion: 'body'
                });
            },
            
            onStart: function () {
                log('app start');

                this.mainRegion.show(new MainView());

                new Router();
                Backbone.history.start({
                    pushState: false
                });
            }
        });
    }
);