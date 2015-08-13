OLMM.prototype.initSCApp = function (options) {

    options = options || {};
    var featureSelectFunction = options['featureSelectFunction'];
    var icon_ssk_default = options['icon_ssk_default'];
    var icon_ssk_selected = options['icon_ssk_selected'];
    var icon_smk_default = options['icon_smk_default'];
    var icon_smk_selected = options['icon_smk_selected'];
    var icon_default = options['icon_default'];
    var wmsLayers = options['wmsLayers'];

    var self = this;

    self.createMap();
    self.loadWMSLayers(wmsLayers);

    var layer_name = 'edit';
    self.setDefaultSourceName(layer_name);

    self.addSource('searchSource', self.createVectorSource());

    self.addMapClickFunction(self.SCResetFeaturesStateStyle.bind(self));
    self.addClusterClickFunction(layer_name);

    var sel = function (event, feature_data) {
        self.SCChangeStyleOnSelect(feature_data.id);
        return featureSelectFunction(event, feature_data);
    };

    self.addFeatureClickFunction(sel, 'edit');

    var layer = self.getLayerByName(layer_name);
    if (!layer) {
        self.addLayer(layer_name, self.createVectorLayer(
            function (feature, resolution) {
                var featureProperties = feature.getProperties();

                if (feature.getGeometry().getType() == 'Point') {
                    var featureObjectType = featureProperties['objecttype'];
                    var featureState = featureProperties['_state'] || 'default';

                    var icon_url;

                    if (featureObjectType == 'ssk') {
                        if (featureState == 'selected') {
                            icon_url = icon_ssk_selected
                        } else {
                            icon_url = icon_ssk_default
                        }
                    } else if (featureObjectType == 'smk') {
                        if (featureState == 'selected') {
                            icon_url = icon_smk_selected
                        } else {
                            icon_url = icon_smk_default
                        }
                    } else {
                        icon_url = icon_default
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

    self.enableCluster('edit', 'objecttype');
};

OLMM.prototype.SCChangeStyleOnSelect = function (featureId) {
    var self = this;
    self.getSourceByName(self.getDefaultSourceName()).getFeatureById(featureId).setProperties({"_state": 'selected'})
};

OLMM.prototype.SCResetFeaturesStateStyle = function () {
    var self = this;
    self.getSourceByName(self.getDefaultSourceName()).getFeatures().map(function (f) {
        f.setProperties({"_state": "default"})
    })
};
