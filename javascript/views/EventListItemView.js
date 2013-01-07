define(['vendors/Xenon/ListItemView'] , function (ListItemView) {
  var EventListItemView = ListItemView.extend({
    className: 'event-list-item',
    template: _.template(
      '<div class="image-wrapper"><img src="{{image}}" title="{{Title}}" /></div>' +
      '<div class="bar">' +
        '<div class="title">{{Title}}</div>' +
        '<div class="price">{{Price}}</div>' +
        '<div class="condition">{{Condition}}</div>' +
      '</div>'
    ),

    render: function () {
      this.$el.html(
        this.template(_.merge(this.model.toJSON() , {
          image: this.model.getMainPhotoUrl()
        }))
      );
    }

  });
  return EventListItemView;
});
