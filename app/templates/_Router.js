define(['<%= _.slugify(modulePrefix) %>-routes-controller'], function (RoutesController) {
    return Backbone.Marionette.AppRouter.extend({
        initialize: function () {
            log('router init');
        },
        controller: new RoutesController(),
        appRoutes: {
            "*path": "defaultRoute"
        }
    });
});