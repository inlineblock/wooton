define([] , function () {
  var Event = Backbone.Model.extend({
    idAttribute: 'Id',
    defaults: {
      'Condition': ''
    },

    update: function (o) {
      return this.clear({silent: true}).set(o);
    },

    
    getMainPhotoUrl: function () {
      return this.get('Photos')[0].url;
    }
  });
  return Event;
});
