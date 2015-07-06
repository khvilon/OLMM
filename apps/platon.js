OLMM.prototype.initPlatonApp = function () {
    var self = this;

    self.createMap();

    var sel = function(event, data) {
        return olmm.config['featureClickCallback'](event.pixel, data)
    };

    self.addFeatureClickFunction(sel);

    self.map.addInteraction(new self.hoverApp.Hover());

    self.addLayer('map', self.createOSMLayer());

    //self.addMapClickFunction(self.resetFeaturesStateStyle.bind(self));

    self.readConfig({
        'icons': {
            1: 'http://www.mapize.com/generator/generatorSource/images_mapize/library/mapize_marker_green.png',
            2: 'http://www.dmv.ri.gov/img/map/blue-dot.png'
        }
    });

    var layer_name = 'edit';
    var layer = self.getLayerByName(layer_name);
    if (!layer) {
        self.addLayer(layer_name, self.createVectorLayer(
            function (feature, resolution) {

                var featureProperties = feature.getProperties();
                var featureType = featureProperties['type'];

                var iconStyleName = 'icon'+featureType;
                var icon_style = self.getStyleByName(iconStyleName);
                if (!icon_style) {
                    icon_style = self.addStyle(iconStyleName, self.createIconStyle(self.config.icons[featureType]));
                }

                return [icon_style];
            }
        ));
    }
};

OLMM.prototype.addPlatonFeatureClickFunction = function (func) {
    this.addToConfig('featureClickCallback', func);
};