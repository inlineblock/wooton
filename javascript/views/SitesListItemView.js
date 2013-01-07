define(['views/EventListItemView' , 'views/EventListView' , 'vendors/Xenon/ListItemView'] , function (EventListItemView , EventListView , ListItemView) {
  var SitesListItemView = ListItemView.extend({
    className: 'sites-list-item-view',
    tagName: 'x-slide',

    template: _.template('<div class="title" style="background-color: {{color}}">{{title}}</div><div class="main-event-container"></div><div class="extra-events-container"></div>'),

    render: function () {
      this.$el.html(
        this.template({
          title: this.model.get('title'),
          color: this.model.get('color')
      }));
      this.mainEventContainer = this.$('.main-event-container');
      this.extrasContainer = this.$('.extra-events-container');
      if (this.activated) {
        this.setupEvents();
      }
    },

    activate: function () {
      if (!this.activated) {
        this.activated = true;
        this.setupEvents();
      }
    },

    deactivate: function () {
      if (this.activated) {
        this.activated = false;
        this.teardownEvents();
      }
    },

    teardownEvents: function () {
      if (this.mainEventView) {
        this.mainEventView.destroy();
        delete this.mainEventView;
      }

      if (this.extrasListView) {
        this.extrasListView.destroy();
        delete this.extrasListView;
      }
    },

    setupEvents: function () {
      if (this.model.hasMain()) {
        if (!this.mainEventView) {
          this.mainEventView = new EventListItemView({model: this.model.getMain()});
          this.mainEventContainer.append(this.mainEventView.$el);
        }
        this.mainEventView.render();
      }
      if (this.model.hasExtras()) {
        if (!this.extrasListView) {
          this.extrasListView = new EventListView({collection: this.model.getExtras()});
          this.extrasContainer.append(this.extrasListView.$el);
        }
      }
    }
  });
  return SitesListItemView;
});
