define(['models/Site'] , function (Site) {
  var Sites = Backbone.Collection.extend({
    url: 'http://www.deliciousmorsel.com/cache/v2/',
    model: Site,
    parse: function (o) {
      if ('sites' in o) {
        return o.sites;
      } else {
        return o;
      }
    },

    comparator: function (m) {
      return m.get('sort');
    },

    fetch: function (o) {
      o = o || {};
      var that = this,
        success = o.success || $.noop,
        error = o.error || $.noop;
        onSuccess= function () {
          that.trigger('fetch:complete' , that).trigger('fetch:success' , that);
          success.apply(this , arguments);
        },
        onError = function () {
          that.trigger('fetch:complete' , that).trigger('fetch:error' , that);
          error.apply(this , arguments);
        };
      o.success = onSuccess;
      o.error = onError;
      Backbone.Collection.prototype.fetch.apply(this , [o]);
      this.trigger('fetch');
    }
  });
  return Sites;
});
