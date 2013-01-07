define([] , function () {
	return Backbone.View.extend({
		className: 'list-item',

		constructor: function BaseListItemView () {
			return Backbone.View.apply(this , arguments);
		},

		initialize: function () {
			this.attach();
			this.$el.attr('data-id' , this.model.id);
		},

		destroy: function () {
      this.$el.remove();
			this.detach();
		},

		getModelEvents: function () {
			return 'change';
		},

		attach: function () {
			var events = this.getModelEvents();
			if (this.model && events) {
				this.model.on(events , this.onModelChange , this);
			}
		},

		detach: function () {
			var events = this.getModelEvents();
			if (this.model && events) {
				this.model.off(events , this.onModelChange , this);
			}
		},

		setModel: function (model) {
			this.detach();
			this.model = model;
			this.attach();
			return this;
		},

		onModelChange: function () {
			this.render();
		},

		render: function () {
			this.renderAutoClassNames();
			return this;
		},

		renderAutoClassNames: function () { // this iterates through the array, if the value of attr in the model is truthy it adds it, other wise it removes it
			if (this.autoClassNames && this.autoClassNames.length) {
				_.each(this.autoClassNames , function (attr) {
					if (this.model.get(attr)) {
						this.$el.addClass(attr);
					} else {
						this.$el.removeClass(attr);
					}
				} , this);
			}
		}

	});
});
