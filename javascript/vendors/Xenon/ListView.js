define([] , function () {
  var ListView = Backbone.View.extend({

    className: 'list-view',

    emptyTemplate: _.template('<div class="list-view-no-content"><h1>{[title]}</h1><p>{[message]}</p></div>'), 

    groupViewClass: false,
    groupEvents: {

    },

    listItemViewClass: false,

    listItemEvents: {
    },

		options: {
			noContentTitle: '',
			noContentMessage: 'There was nothing found!',
      debounce: true
    },

    constructor: function ListView() {
      return Backbone.View.apply(this,arguments);
    },

    //! This sets up the collection and the appropriate event handlers.
    initialize: function() {
      if (this.options.debounce) {
        this.render = _.chain(this.render).bind(this).debounce(50 , false).value();
      } else {
        this.render = _.chain(this.render).bind(this).value();
      }
      // member fields
      this.collection = this.collection || new Backbone.Collection();
      this.itemViews = {};
      this.build();
      this.attach();
      this.$el.addClass(ListView.prototype.className);

      // cause the rendering to debounce
      this.render();
    },

    destroy: function () {
      this.cleanupViews();
      this.cleanGroups();
      this.remove();
      this.detach();
      this._deleted = true;
      return this;
    },

    getCollectionEvents: function () {
      return 'add reset remove';
    },

    attach: function () {
      this.collection.on(this.getCollectionEvents() , this.render, this);
    },

    detach: function () {
      this.collection.off(this.getCollectionEvents() , this.render, this);
    },

    setCollection: function (collection) {
      this.detach();
      this.collection = collection;
      this.attach();
      this.render();
    },

    build: function () {
      this.setContentElement(this.el);
    },

    //! Set the content element, this is the element to which the list items are
    //! added.
    setContentElement: function(el) {
      this.content = $(el);
    },

    getContentElement: function () {
      return this.content;
    },

    //! Remove this view from the DOM.  This removes the events as well.
    remove: function() {
      this.$el.remove();
      this.detach();
      this.cleanupViews();
    },

    //! Return an array of all of the list items.
    listItemViews: function() { return _.values(this.itemViews); },

    //! Get a list item view from the model.
    getViewByModel: function(model) {
      return this.getViewItemForModel(model);
    },

    getViewItemForModel: function (model) {
      return model ? this.itemViews[this.getUniqueIdentifierForModel(model)] : null;
    },

    setViewItemForModel: function (view , model) {
      return this.itemViews[this.getUniqueIdentifierForModel(model)] = view;
    },

    getUniqueIdentifierForModel: function (model) {
      return model.cid;
    },

    filterModels: function (models , filter) {
      return _.where(models , filter);
    },

    shouldFilter: function () {
      return this.filter ? true : false;
    },

    getModels: function () {
      var models = this.collection.toArray();
      if (this.shouldFilter()) {
        models = this.filterModels(models , this.filter);
      }
      return models;
    },

    buildViewItems: function(models) {
      var views = _.map(models , function(model) {
        var view = this.getViewByModel(model);
        if (!view) {
          view = this.createListItemView(model);
          this.setViewItemForModel(view , model);
        }
        return view;
      } , this);
      return _.compact(views);
    },

    createListItemView: function (model) {
      var view = new (this.listItemViewClass)({model: model , appData: this.options.appData , listView: this});
      this.bindEventsToView(view , this.listItemEvents);
      view.render();
      return view;
    },

    cleanupOldViews: function () {
      // delete the views which are no longer in the collection
      var present = this.collection.map(function(m) { return this.getUniqueIdentifierForModel(m); } , this);
      var missing = _.difference(_.keys(this.itemViews),present);
      _.each(missing , this.cleanupOldView ,this);
    },

    cleanupViews: function () {
      var present = this.collection.map(function(m) { return this.getUniqueIdentifierForModel(m); } , this);
      _.each(present , this.cleanupOldView , this);
      var keys = _.keys(this.itemViews);
      _.each(keys , this.cleanupOldView , this);
      this.itemViews = {};
    },

    cleanupOldView: function (id) {
      var view = this.itemViews[id];
      if (view) {
        delete this.itemViews[id];
        this.unbindEventsFromView(view , this.listItemEvents);
        if (view.remove) {
          view.remove();
        }
        if (view.destroy) {
          view.destroy();
        } else {
          //console.warn('View needs destroy method!' , view);
        }
      }
    },

    setFilter: function (filter) {
      this.filter = filter;
    },

    beforeRender: function () {
      this.trigger('beforerender');
    },

    //! Make sure all of the views are properly rendered. This will also delete
    //! any items which are no longer contained in the collection.
    render: function() {
      this.beforeRender();
      this.trigger('render');
      if (this.shouldFilter()) {
        _.defer(function(that) {
          that.renderChainGetModels();
        } , this);
      } else {
        this.renderChainGetModels();
      }
    },

    renderChainGetModels: function () {
      var models = this.getModels();
      if (models.length > 100) {
        _.defer(function(that) {
          that.renderChainCreateViews(models);
        } , this);
      } else {
        this.renderChainCreateViews(models);
      }
    },

    renderChainCreateViews: function (models) {
      var views = this.buildViewItems(models);
      this.renderChainSortViews(views);
    },


    renderChainSortViews: function (views) {
      if (this.shouldSort()) {
        _.defer(function(that) {
          views = that.sortViews(views);
          that.renderChainNotifyViews(views);
        } , this);
      } else {
        this.renderChainNotifyViews(views);
      }
    },

    renderChainNotifyViews: function (views) {
      _.each(views , function(view , i) {
        view.options.listItemIndex = i;
        if (view.beforeDisplay) {
          view.beforeDisplay();
        }
      });
      this.renderChainSetupContent(views);
    },

    renderChainSetupContent: function (views) {
      this.content.contents().detach();
      if (this.shouldGroup()) {
        // allow the views to be grouped
        this.cleanGroups();
        var groupedViews = _.groupBy(views , this.groupBy , this);
        this.groups = this.renderGroups(groupedViews);
        this.content.append( _.pluck( this.groups , 'el') );
      } else { // no grouping, just append
        this.content.append(
          _.pluck(views , 'el')
        );
      }
      this.renderChainCompletion(views);
    },

    renderChainCompletion: function (views) {
      this.trigger('rendercomplete');
      _.defer(function(that) {
        that.afterRender(views);
      }, this);
      return this;
    },

    afterRender: function (views) {
      _.defer(function (that) {
        that.cleanupOldViews();
      } , this);

      
      if (!views.length) {
        this.showEmptyView(this.filter ? true : false);
      } else {
        this.hideEmptyView();
      }

      this.trigger('afterRender');
    },

    cleanGroups: function () {
      if (this.groups && this.groups.length) {
        var groups = this.groups;
        delete this.groups;
        _.each(groups , function (group) {
          if (group && group.destroy) {
            group.destroy();
          }
        });
      }
    },

    renderGroups: function (groupedViews) {
      var groupViews = this.getGroupViewsByGroups(groupedViews);

      if (this.sortGroupsBy) { // sort em, if we can
        groupViews = _.sortBy( groupViews , this.sortGroupsBy , this);
      }
      return groupViews;
    },

    getGroupViewsByGroups: function (viewGroups) {
      var groupViews = [];
      _.each(viewGroups , function(viewGroup , k) {
        var groupView = this.createGroupView({views: viewGroup , grouping: k});
        if (groupView) {
          this.bindEventsToView(groupView , this.groupEvents);
          groupViews.push(groupView);
        }
      } , this);
      return groupViews;
    },

    createGroupView: function (o) {
      var group = (new (this.groupViewClass)(_.merge(o , {
        appData: this.options.appData
      })));
      this.bindEventsToView(group , this.groupEvents);
      return group.render();
    },

    shouldGroup: function () {
      return this.groupBy ? true : false;
    },

    shouldSort: function () {
      return this.sortBy ? true : false;
    },

    sortViews: function (views) {
      return _.sortBy(views , this.sortBy , this);
    },

    bindEventsToView: function (view , events) {
      if (view && events) {
        _.each(events , function (method , event) {
          view.on(event , this[method] , this);
        } , this);
      }
    },

    unbindEventsFromView: function (view , events) {
      if (view && events) {
        _.each(events , function (method , event) {
          view.off(event , this[method] , this);
        } , this);
      }
    },

    hideEmptyView: function () {

    },

    showEmptyView: function () {
      this.content.html(
        this.emptyTemplate({
          message: (this.options.noContentMessage || 'There was nothing found!'),
          title: this.options.noContentTitle
        })
      );
    },

    showTransactions: function (evt) {
      this.trigger('showTransactions' , evt);
    }
  });
  return ListView;
});
