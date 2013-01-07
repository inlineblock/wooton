 _.mixin({
  mixinClass: function _Mix () {
    var klass = arguments[0],
      mixables = Array.prototype.slice.call(arguments , 1);
    _.each(mixables , function(mixable) {
      _.each(mixable.prototype , function (method , name) {
        if (!klass.prototype.hasOwnProperty(name)) {
          klass.prototype[name] = method;
        }
      });
    });
    return klass;
  },

  merge: function _Merge () {
    var merged = {};
    for (var i = 0, l = arguments.length; i < l; i++){
      var object = arguments[i];
      for (var key in object) {
        merged[key] = object[key];
      }
    }
    return merged;
  },

  classCase: function _ClassCase (string) {
    string = string.replace(/(\-|_|\s)+(.)?/g, function(match, separator, chr) {
      return chr ? chr.toUpperCase() : '';
    });
    return string.charAt(0).toUpperCase() + string.substring(1);
  },

  matches: function (item , attrs) {
    for (var key in attrs) {
      if (item.get && _.isFunction(item.get)) {
        if (attrs[key] != item.get(key)) return false;
      } else {
        if (attrs[key] != item[key]) return false;
      }
    }
    return true;
  },

  where: function (list , attrs) {
    if (_.isEmpty(attrs)) return [];
    return _.filter(list , function (item) {
      return _.matches(item , attrs);
    });
  }
});

_.templateSettings = {
  interpolate : /\{\[(.+?)\]\}/g,
  evaluate: /\{%([\s\S]+?)%\}/g,
  escape : /\{\{(.+?)\}\}/g
};
