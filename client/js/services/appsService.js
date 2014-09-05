'use strict';

angular.module('featureToggleFrontend')

.factory('AppsService', function(ENV, $http, etcdApiService, App, Toggle, ToggleService) {

  function AppsService(){
    this.apps = [];
    this.selectedApp = null;
    this.selectedToggle = null;
  }

  AppsService.prototype = {

    loadApps:function(){
      return etcdApiService.getApplications()
        .success(this.setApps.bind(this));
    },

    loadApp:function(appName){
      return etcdApiService.getApplication(appName)
        .success(this.setSelectedApp.bind(this));
    },

    updateToggles: function() {
      this.selectedApp.loadToggles();
    },

    updateApps: function() {
      return etcdApiService.getApplications()
        .success(this.refreshApps.bind(this));
    },

    refreshApps: function(response) {
      this.apps = response.node.nodes.map(App.create);
    },

    setSelectedApp: function(response) {
      var app = App.create(response.node);
      this.selectedApp = app;
      this.selectedApp.loadToggles();
    },

    setApps:function(response){
      this.apps = response.node.nodes.map(App.create)
                    .sort(function(a, b){
                      if(a.appName < b.appName) return -1;
                      if(a.appName > b.appName) return 1;
                      return 0;
                    });
      this.selectedApp = this.selectedApp || this.apps[0];
      this.selectedApp.loadToggles();
    },

    loadToggle:function(appName, toggleName){
      return ToggleService.loadToggle(appName, toggleName)
        .success(this.setSelectedToggle.bind(this));
    },

    setSelectedToggle: function(response) {
      var toggle = Toggle.create(response.node);
      this.selectedToggle = toggle;
      this.selectedToggle.loadAudit();
    },

    updateToggle: function(toggle) {
      return etcdApiService.updateToggle(toggle);
    }

  };

  return new AppsService();

});
