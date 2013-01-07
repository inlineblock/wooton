define([] , function () {
  var Loader = Backbone.View.extend({
    className: 'loader',
    initialize: function () {
      this.$el.html('<ul class="loader-animation">' + 
                      '<li class="loader-animation_1" ></li><li class="loader-animation_2" ></li>' +
                      '<li class="loader-animation_3" ></li><li class="loader-animation_4" ></li>' + 
                      '<li class="loader-animation_5" ></li><li class="loader-animation_6" ></li>' + 
                      '<li class="loader-animation_7" ></li><li class="loader-animation_8" ></li>' +
                    '</ul>');
    },

    show: function () {
      this.$el.show();
      return this;
    },

    hide: function () {
      this.$el.hide();
      return this;
    }
  });
  return Loader;
});
