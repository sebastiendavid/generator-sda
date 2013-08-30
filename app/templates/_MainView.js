define(['<%= _.slugify(modulePrefix) %>-text!templates/main.html'], function (html) {
    return Backbone.Marionette.ItemView.extend({
        initialize: function () {
            log('init main view');
        },
        model: new Backbone.Model({
            title: 'Hello!'
        }),
        template: Handlebars.compile(html)
    });
});