require(['collections/Sites' , 'views/SitesListView'] , function (Sites , SitesListView) {
  var WootOn = function (o) {
    this.initialize();
  };

  _.extend(WootOn.prototype , {
    initialize: function () {
      this.body = $('body');
      this.checkForInstall();
      this.build();
    },

    checkForInstall: function () {
      if (navigator && navigator.mozApps && navigator.mozApps.getSelf) {
        var request = navigator.mozApps.getSelf();
        request.onsuccess = function () {
          console.log('onSuccess' , arguments);
          navigator.mozApps.install('http://wooton.deliciousmorsel.com/wooton.manifest.webapp')
        }
        request.onerror = function () {
          console.log('onerror' , arguments);

        }
      }
    },

    build: function () {
      var sites = new Sites();
      this.view = new SitesListView({
        collection: sites
      });
      this.body.append(this.view.$el);
      sites.fetch();
    }
  });

  $(function () {
    this.app = new WootOn();
  });
});
