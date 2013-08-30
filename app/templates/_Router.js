define(['marionette', '<%= _.slugify(modulePrefix) %>-routes-controller'],
	function (Marionette, RoutesController) {
		return Marionette.AppRouter.extend({
			
			controller: new RoutesController(),

			appRoutes: {
				"*path": "defaultRoute"
			},

			initialize: function () {
				log('router init');
			}
		});
	}
);