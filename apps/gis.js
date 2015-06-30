OLMM.prototype.initGisApp = function () {
    var self = this;
    var ssk_icon_style_name, ssk_icon_style_url;

    var layer_name = 'edit';
    var layer = self.getLayerByName(layer_name);
    if (!layer) {
        self.addLayer(layer_name, self.createVectorLayer(
            function (feature, resolution) {

                if (feature.getGeometry().getType() == 'Point') {

                    var featureProperties = feature.getProperties();
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

                        var icon_style_name = icon_url.replace(/\s+/g, '-').replace(/[^a-zA-Z-]/g, '').toLowerCase();

                        var icon_style = self.getStyleByName(icon_style_name);

                        if (!icon_style) {
                            icon_style = self.addStyle('default_icon', self.createIconStyle(icon_url));
                        }

                        return [icon_style];

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
            }
        ));
    }
};

OLMM.prototype.getCoordsForRequest = function () {
    var self = this;
    var coords = self.getViewPortCoords();

    return {
        'min_lot': coords[0],
        'min_lat': coords[1],
        'max_lot': coords[2],
        'max_lat': coords[3]
    }
};

OLMM.prototype.updateSSKPoints = function (ssk_name) {
    var self = this;
    self.updateFeatureProperties({
        source_name: 'edit',
        update_params: {"_state_additional": ssk_name},
        filter_params: {"objecttype": 1}
    })
};

OLMM.prototype.gisFindAndMarkFeatures = function (filter_params) {
    this.updateFeatureProperties({
        "source_name": 'edit',
        "filter_params": filter_params,
        "update_params": {"_state": 'in_search'}
    })
};

OLMM.prototype.gisUpdateInSearchState = function (featuresId) {
    var self = this;
    var source = self.getSourceByName('edit');
    featuresId.map(function(fId){source.getFeatureById(fId).setProperties({"_state": 'selected'})})
};

OLMM.prototype.gisChangeStyleOnSelect = function(featureId) {
    olmm.getSourceByName('edit').getFeatureById(featureId).setProperties({"_state": 'selected'})
};

OLMM.prototype.resetFeaturesStateStyle = function () {
    olmm.getSourceByName('edit').getFeatures().map(function(f){f.setProperties({"_state": "default"})})
};
