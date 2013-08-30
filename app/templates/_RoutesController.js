define(['backbone', 'marionette', '<%= _.slugify(modulePrefix) %>-content-region'],
    function (Backbone, Marionette, ContentRegion) {
        return Marionette.Controller.extend({

            region: new ContentRegion(),

            defaultRoute: function () {
                log('go to default route');
                /*
                this.navigate('some-path');

                or

                this.region.show(new SomeView());
                */
            },
            
            navigate: function (hash) {
                Backbone.history.navigate(hash, {
                    trigger: true,
                    replace: false
                });
            }
        });
    }
);