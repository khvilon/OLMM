OLMM.prototype.initGisApp = function (layers) {

    var styleFunction = function (feature, resolution) {

        var featureProperties = feature.getProperties();
        var featureVisible = featureProperties['visible'];

        if (featureVisible == false) {
            return []
        }

        if (feature.getGeometry().getType() == 'Point') {
            var featureObjectType = featureProperties['objecttype'];
            var featureState = featureProperties['_state'] || 'default';
            featureState += featureProperties['_state_additional'] || '';

            if (featureObjectType != undefined) {

                var icon_config = self.config.icons.objecttype[featureObjectType];
                if (icon_config) {
                    var icon_url = icon_config[featureState];
                } else {
                    icon_url = self.config.icons.objecttype[featureState];
                    if (!icon_url) {
                        icon_url = self.config.icons[featureState];
                    }
                }

                return [new ol.style.Style({
                    image: new ol.style.Icon({
                        src: icon_url
                    }),
                    text: new ol.style.Text({
                        text: feature.getProperties()['count'],
                        size: 24,
                        fill: new ol.style.Fill({
                            color: '#000000'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#000000'
                        })
                    })
                })]

            } else {
                return [new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: '#ff9900',
                            opacity: 0.6
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#ffcc00',
                            opacity: 0.4
                        })
                    }),
                    text: new ol.style.Text({
                        text: feature.getProperties()['count'],
                        size: 24,
                        fill: new ol.style.Fill({
                            color: '#000000'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#000000'
                        })
                    })
                })]
            }
        } else {

            var line_style_name = 'baseLineStyle';
            var line_style = self.getStyleByName(line_style_name);
            if (!line_style) {
                line_style = self.addStyle(
                    line_style_name,
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: feature.getProperties()['color'] || 'green',
                            width: 3
                        })
                    })
                )
            }

            return [line_style];
        }
    };

    layers = layers || {};

    var svpLayerName = layers['svpLayerName'];
    //var nosignalLayerName = layers['nosignalLayerName'];
    //var cpointsLayerName = layers['cpointsLayerName'];

    var self = this;

    self.setDefaultSourceName(svpLayerName);

    self.addSource('searchSource', self.createVectorSource());

    self.addMapClickFunction(self.resetFeaturesStateStyle.bind(self));
    self.addClusterClickFunction(svpLayerName);

    var layers = Object.keys(layers).map(function (layerName) {
        return layers[layerName];
    });

    for (var i = 0; i < layers.length; i++) {
        var layerName = layers[i];
        var layer = self.getLayerByName(layerName);
        if (!layer) {
            self.addLayer(layerName, self.createVectorLayer(styleFunction));
        }
    }

};

OLMM.prototype.getCoordsForRequest = function () {
    var coords = this.getViewPortCoords();

    return {
        'min_lot': coords[0],
        'min_lat': coords[1],
        'max_lot': coords[2],
        'max_lat': coords[3]
    }
};

OLMM.prototype.updateSSKPoints = function (ssk_name) {
    this.updateFeatureProperties({
        filter_params: {"objecttype": 1},
        update_params: {"_state_additional": ssk_name}
    })
};

OLMM.prototype.gisFindAndMarkFeatures = function (filter_params) {
    this.updateFeatureProperties({
        "filter_params": filter_params,
        "update_params": {"_state": 'in_search'}
    })
};

OLMM.prototype.gisUpdateInSearchState = function (featuresId) {
    var self = this;
    var searchSource = self.getSourceByName('searchSource');
    searchSource.clear();

    var source = self.getSourceByName(self.getDefaultSourceName());

    var featuresInSearch = featuresId.map(function(fId){
        var feature = source.getFeatureById(fId);
        feature.setProperties({"_state": 'selected'});
        return feature.clone()
    });

    searchSource.addFeatures(featuresInSearch);

    self.fitToExtent('searchSource');
};

OLMM.prototype.gisChangeStyleOnSelect = function(featureId) {
    var self = this;
    self.getSourceByName(self.getDefaultSourceName()).getFeatureById(featureId).setProperties({"_state": 'selected'})
};

OLMM.prototype.resetFeaturesStateStyle = function () {
    var self = this;
    self.getSourceByName(self.getDefaultSourceName()).getFeatures().map(function(f){f.setProperties({"_state": "default"})})
};
