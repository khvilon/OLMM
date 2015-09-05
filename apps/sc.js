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

    var styleIconMap = {
        'smk': icon_smk_default,
        'ssk': icon_ssk_default,
        'cod': icon_cod_default,
        'cipp': icon_cipp_default
    };

    var layer = self.getLayerByName(layer_name);
    if (!layer) {
        self.addLayer(layer_name, self.createVectorLayer(
            function (feature, resolution) {
                var featureProperties = feature.getProperties();

                if ( featureProperties['visible'] === false ||
                     featureProperties['filterVisible'] === false ||
                     feature.getGeometry().getType() != self.pointName
                ) { return [] }

                var featureObjectType = featureProperties['type'];

                var icon_url = styleIconMap[featureObjectType];
                if (!icon_url) {
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
            }
        ));
    }

    self.enableCluster(layer_name, 'type');

    var styleOwnerColorMap = [
        {"from": 0, "to": 9, 'color': '#8CC600'},
        {"from": 10, "to": 19, 'color': '#7BAB0D'},
        {"from": 20, "to": 29, 'color': '#6A901A'},
        {"from": 30, "to": 39, 'color': '#597528'},
        {"from": 40, "to": 99999999, 'color': '#485A35'}
    ];

    var selectOwnerColor = function(owners, rate) {
        if (!rate) {
            rate = 1;
        }
        return styleOwnerColorMap.filter(function(colorMap){
            return colorMap["from"] * rate <= owners && owners <= colorMap["to"] * rate
        })[0]['color']
    };

    var layer_owners = 'owners';
    self.addClusterClickFunction(layer_owners);

    var layerOwner = self.getLayerByName(layer_owners);
    if (!layerOwner) {
        self.addLayer(layer_owners, self.createVectorLayer(
            function (feature, resolution) {
                var featureProperties = feature.getProperties();

                if ( featureProperties['visible'] === false ||
                     featureProperties['filterVisible'] === false ||
                     feature.getGeometry().getType() != self.pointName
                ) { return [] }

                var owners = featureProperties['owners'] || 0;
                var stroke;
                if (featureProperties['count'] && featureProperties['count'] > 0) {
                    stroke = new ol.style.Stroke({
                        color: '#000000'
                    })
                }

                return [new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 10,
                        fill: new ol.style.Fill({
                            color: selectOwnerColor(owners)
                        }),
                        stroke: stroke
                    }),
                    text: new ol.style.Text({
                        text: owners,
                        size: 25,
                        fill: new ol.style.Fill({
                            color: '#FFFFFF'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#FFFFFF'
                        })
                    })
                })]
            }
        ));
    }

    self.setLayerVisible(layer_owners, false);

    self.enableCluster(layer_name, 'type');
    self.enableCluster(layer_owners);
};

