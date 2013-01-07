define(['models/Event' , 'collections/Events'] , function (Event , Events) {
  var Site = Backbone.Model.extend({

    initialize: function (o) {
      this.on('change:extras' , this.onExtrasChange , this);
      this.on('change:main'  , this.onMainChange , this);
      this.on('change' , this.onChange , this);
      this._extras = new Events(o.extras);
      this._main = new Event(o.main);
    },

    onChange: function () {
      console.log('onChange' , arguments);
    },

    onExtrasChange: function () {
      this._extras.update(this.get('extras'));
    },

    onMainChange: function () {
      this._main.update(this.get('main'));
    },

    getExtras: function () {
      return this._extras;
    },

    getMain: function () {
      return this._main;
    },

    hasExtras: function () {
      console.log('hasExtras' , this._extras);
      return this._extras.length;
    },

    hasMain: function () {
      return this.get('main');
    },

    parse: function (o) {
      if ('site' in o) {
        return o.site;
      } else {
        return o;
      }
    }
  });
  return Site;
});
