OLMM.prototype.initPlatonApp = function (callback, popup, icon1, icon2) {
    var self = this;

    var overlay = new ol.Overlay({
      element: popup,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    self.createMap();

    self.addOverlay('overlay', overlay);

    var sel = function(event, data) {
        overlay = self.getOverlayByName('overlay');
        overlay.setPosition(self.transform(data.coords));
        return olmm.config['featureClickCallback'](event.pixel, data)
    };

    self.addFeatureClickFunction(sel);

    this.addToConfig('featureClickCallback', callback);

    self.map.addInteraction(new self.hoverApp.Hover());

    self.addLayer('map', self.createOSMLayer());

    var icon1style = self.addStyle('icon1', self.createIconStyle(icon1));
    var icon2style = self.addStyle('icon2', self.createIconStyle(icon2));

    var layer_name = 'edit';
    self.defaultSourceName = layer_name;
    var layer = self.getLayerByName(layer_name);
    if (!layer) {
        self.addLayer(layer_name, self.createVectorLayer(
            function (feature, resolution) {

                var featureProperties = feature.getProperties();
                var featureTcos = featureProperties['tcos'];

                if (featureTcos == true) {
                    return [icon1style]
                } else {
                    return [icon2style]
                }
            }
        ));
    }
};
