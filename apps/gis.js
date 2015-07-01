OLMM.prototype.initGisApp = function () {
    var self = this;

    self.addMapClickFunction(self.resetFeaturesStateStyle.bind(self));
    var ssk_icon_style_name, ssk_icon_style_url;

    var layer_name = 'edit';
    var layer = self.getLayerByName(layer_name);
    if (!layer) {
        self.addLayer(layer_name, self.createVectorLayer(
            function (feature, resolution) {

                if (feature.getGeometry().getType() == 'Point') {

                    var featureProperties = feature.getProperties();
                    var featureVisible = featureProperties['visible'];
                    var featureObjectType = featureProperties['objecttype'];
                    var featureState = featureProperties['_state'] || 'default';
                    featureState += featureProperties['_state_additional'] || '';

                    if (featureVisible == false) {
                        return []
                    }

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
                    var featureProperties = feature.getProperties();
                    var featureVisible = featureProperties['visible'];

                    if (featureVisible == false) {
                        return []
                    }

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
    this.getSourceByName('edit').getFeatureById(featureId).setProperties({"_state": 'selected'})
};

OLMM.prototype.resetFeaturesStateStyle = function () {
    this.getSourceByName('edit').getFeatures().map(function(f){f.setProperties({"_state": "default"})})
};

OLMM.prototype.toggleFeaturesPointLayer = function () {
    var self = this;
    var new_visible = !self.getSourceByName('edit').getFeatures()[0].getProperties()['visible'];
    self.pointsShow = new_visible;
    self.getSourceByName('edit').getFeatures().map(
        function (f) {if (f.getGeometry().getType() == 'Point') {f.setProperties({'visible': new_visible})}}
    )
};

OLMM.prototype.getFeaturesVisibleByType = function (type) {
    var self = this;
    var features = self.getSourceByName('edit').getFeatures();
    var visible;

    if (type == 'Point' && self.pointShow != undefined) {
        return !self.pointShow
    }

    if (type == 'Polygon' && self.polygonShow != undefined) {
        return !self.polygonShow
    }

    for (var i = 0; i <= features.length; i++) {
        var feature = features[i];
        if (feature && feature.getGeometry().getType() == type) {
            visible = feature.getProperties()['visible'];
            if (visible) {
                break
            }
        }
    }

    if (visible == undefined) {
        visible = false;
    }

    return visible;
};

OLMM.prototype.toggleFeaturesPolygonLayer = function () {
    var self = this;
    var type = 'Polygon';
    var new_visible = self.getFeaturesVisibleByType(type);
    self.polygonShow = new_visible;
    self.getSourceByName('edit').getFeatures().map(
        function (f) {if (f.getGeometry().getType() == type) {f.setProperties({'visible': new_visible})}}
    )
};

OLMM.prototype.toggleFeaturesPointLayer = function () {
    var self = this;
    var type = 'Point';
    var new_visible = self.getFeaturesVisibleByType(type);
    self.pointShow = new_visible;
    self.getSourceByName('edit').getFeatures().map(
        function (f) {if (f.getGeometry().getType() == type) {f.setProperties({'visible': new_visible})}}
    )
};
