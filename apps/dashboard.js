OLMM.prototype.initSMKApp = function (options) {
    var self = this;

    options = options || {};
    var icon = options['icon'];
    var callback = options['callback'];

    self.lastDrawPointId = null;

    self.addStyle('icon1', self.createIconStyle(icon));

    self.createMap();
    self.createDashboardLayers();
};

OLMM.prototype.createDashboardLayers = function () {

};