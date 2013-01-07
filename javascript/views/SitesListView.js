define(['vendors/Xenon/ListView' , 'views/SitesListItemView' , 'views/Loader'] , function (ListView , SitesListItemView , Loader) {
  var SitesListView = ListView.extend({
    className: 'sites-list-view',
    listItemViewClass: SitesListItemView,

    template: '<x-slidebox><x-slides></x-slides></x-slidebox><div class="left-arrow"></div><div class="right-arrow"></div>',

    events: {
      'click .left-arrow' : 'onLeftArrowClick',
      'click .right-arrow' : 'onRightArrowClick'
    },

    initialize: function () {
      ListView.prototype.initialize.apply(this , arguments);
      this.loader = new Loader().hide();
      $('body').append(this.loader.$el);
    },

    build: function () {
      this.$el.html(this.template);
      this.setContentElement(this.$('x-slides'));
      this.leftArrow = this.$('.left-arrow');
      this.rightArrow = this.$('.right-arrow');
    },

    attach: function () {
      ListView.prototype.attach.apply(this , arguments);
      this.collection.on('fetch' , this.onCollectionFetch , this);
      this.collection.on('fetch:complete' , this.onCollectionFetchComplete , this);
    },

    detach: function () {
      ListView.prototype.detach.apply(this , arguments);
      this.collection.off('fetch' , this.onCollectionFetch , this);
      this.collection.off('fetch:complete' , this.onCollectionFetchComplete , this);
    },

    onCollectionFetch: function () {
      this.loader.show();
    },
    
    onCollectionFetchComplete: function () {
      this.loader.hide();
    },

    afterRender: function (views) {
      ListView.prototype.afterRender.apply(this, arguments);
      //this.loader.hide();
      this.showPageAtIndex(0);
    },

    setupArrows: function () {
      if (this.currentViewIndex < 1) {
        this.leftArrow.hide();
      } else {
        this.leftArrow.show();
      }
      if (this.currentViewIndex >= this.collection.length - 1) {
        this.rightArrow.hide();
      } else {
        this.rightArrow.show();
      }
    },

    showPageAtIndex: function (index) {
      var model = this.collection.at(index),
        view = this.getViewItemForModel(model),
        activated = [];
      if (!model || !view) {
        return;
      }
      this.currentView = view;
      activated.push(view);
      this.currentViewIndex = index;
      this.currentView.activate();
      this.setupArrows();
      this.$('x-slidebox')[0].slideTo(index);

      var prev = this.collection.at(index - 1),
        next = this.collection.at(index + 1),
        view;
      if (prev) {
        view = this.getViewItemForModel(prev);
        view.activate();
        activated.push(view);
      }
      if (next) {
        view = this.getViewItemForModel(next);
        view.activate();
        activated.push(view);
      }
      _.chain(this.itemViews).values().difference(activated).each(function(view) {
        view.deactivate();
      });
    },

    onLeftArrowClick: function () {
      this.showPageAtIndex(this.currentViewIndex - 1);

    },

    onRightArrowClick: function () {

      this.showPageAtIndex(this.currentViewIndex + 1);
    }
  });
  return SitesListView;
});
