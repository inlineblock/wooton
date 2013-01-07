define(['models/Event'] , function (Event) {
  var Events = Backbone.Collection.extend({
    model: Event,

    update: function (o) {
      var models = _.clone(this.models || []),
        updated = [];
      _.each(o , function(data) {
        var model = this.get(Event.prototype.idAttribute || 'id');
        console.log(model);
      } , this);
      updated.concat(extras);
      return this.reset({silent: true}).add(updated);
    }
  });
  return Events;
});
