define(['backbone', 'marionette', 'handlebars', '<%= _.slugify(modulePrefix) %>-text!templates/main.html'],
	function (Backbone, Marionette, Handlebars, html) {
		return Marionette.ItemView.extend({
			
			template: Handlebars.compile(html),

			model: new Backbone.Model({
				title: 'Hello!'
			}),

			initialize: function () {
				log('init main view');
			}
		});
	}
);