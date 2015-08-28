OLMM.prototype.initSCApp = function (options) {

    options = options || {};
    var featureSelectFunction = options['featureSelectFunction'];
    var icon_ssk_default = options['icon_ssk_default'];
    var icon_ssk_selected = options['icon_ssk_selected'];
    var icon_smk_default = options['icon_smk_default'];
    var icon_smk_selected = options['icon_smk_selected'];

    var icon_cod_default = options['icon_cod_default'];
    var icon_cod_selected = options['icon_cod_selected'];

    var icon_cipp_default = options['icon_cipp_default'];
    var icon_cipp_selected = options['icon_cipp_selected'];

    var icon_default = options['icon_default'];
    var wmsLayers = options['wmsLayers'];

    var self = this;

    self.createMap();
    self.loadWMSLayers(wmsLayers);

    var layer_name = 'edit';
    self.setDefaultSourceName(layer_name);

    self.addSource('searchSource', self.createVectorSource());

    self.addClusterClickFunction(layer_name);

    self.addFeatureClickFunction(function(e, f){console.log(e, f)}, 'edit');

    var layer = self.getLayerByName(layer_name);
    if (!layer) {
        self.addLayer(layer_name, self.createVectorLayer(
            function (feature, resolution) {
                var featureProperties = feature.getProperties();

                if (featureProperties['visible'] === false || featureProperties['filterVisible']) {
                    return []
                }

                if (feature.getGeometry().getType() == 'Point') {
                    var featureObjectType = featureProperties['type'];

                    var icon_url;

                    if (featureObjectType == 'ssk') {
                        icon_url = icon_ssk_default
                    } else if (featureObjectType == 'smk') {
                        icon_url = icon_smk_default
                    } else if (featureObjectType == 'cod') {
                        icon_url = icon_cod_default
                    } else if (featureObjectType == 'cipp') {
                        icon_url = icon_cipp_default
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

    self.enableCluster('edit', 'type');
};

