OLMM.prototype.initSCApp = function (options) {

    options = options || {};
    var featureSelectFunction = options['featureSelectFunction'];

    var icon_ssk_default = options['icon_ssk_default'];
    var icon_ssk_warning = options['icon_ssk_warning'];

    var icon_cod_default = options['icon_cod_default'];
    var icon_truck = options['icon_truck'];

    var icon_cipp_default = options['icon_cipp_default'];

    var icon_default = options['icon_default'];
    var wmsLayers = options['wmsLayers'];

    var self = this;

    self.createMap();
    self.loadWMSLayers(wmsLayers);

    self.addSource('searchSource', self.createVectorSource());

    var styleIconMap = {
        'ssk': icon_ssk_default,
        'sskWarning': icon_ssk_warning,
        'cod': icon_cod_default,
        'cipp': icon_cipp_default
    };

    var sskLayerName = 'ssk';
    var codLayerName = 'cod';
    var cippLayerName = 'cipp';
    var icon_url;

    var get_style = function (icon_url, props) {

        props = props || {};

        if ( props['visible'] === false ||
             props['filterVisible'] === false
        ) {
            return []
        } else {
            var textObj;
            if (props && props['count']) {
                textObj = new ol.style.Text({
                    text: String(props['count']),
                    size: 30,
                    fill: new ol.style.Fill({
                        color: '#000000'
                    })
                })
            }
            return [
                new ol.style.Style({
                    image: new ol.style.Icon({
                        src: icon_url
                    }),
                    text: textObj
                })
            ]
        }
    };

    var sskLayer = self.getLayerByName(sskLayerName);
    if (!sskLayer) {
        self.addLayer(sskLayerName, self.createVectorLayer(
            function (feature, resolution) {
                var featureProperties = feature.getProperties();
                var ssk_icon = icon_ssk_default;
                if (featureProperties && featureProperties['entity']) {
                    ssk_icon = icon_ssk_warning
                }

                return get_style(ssk_icon, featureProperties)
            }
        ))
    }

    var codLayer = self.getLayerByName(codLayerName);
    if (!codLayer) {
        self.addLayer(codLayerName, self.createVectorLayer(
            function (feature, resolution) {
                return get_style(icon_cod_default, feature.getProperties())
            }
        ))
    }

    var cippLayer = self.getLayerByName(cippLayerName);
    if (!cippLayer) {
        self.addLayer(cippLayerName, self.createVectorLayer(
            function (feature, resolution) {
                return get_style(icon_cipp_default, feature.getProperties())
            }
        ))
    }

    var styleOwnerColorMap = [
        {"from": 0, "to": 9, 'color': '#8CC600'},
        {"from": 10, "to": 19, 'color': '#7BAB0D'},
        {"from": 20, "to": 29, 'color': '#6A901A'},
        {"from": 30, "to": 39, 'color': '#597528'},
        {"from": 40, "to": 99999, 'color': '#485A35'}
    ];

    var selectOwnerColor = function(owners) {
        return styleOwnerColorMap.filter(function(colorMap){
            return colorMap["from"] <= owners && owners <= colorMap["to"]
        })[0]['color'] || 'black'
    };

    var layer_owners = 'owners';

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
                var rate = featureProperties['rate'] || 0;

                var stroke;
                if (featureProperties['count'] && featureProperties['count'] > 1) {
                    stroke = new ol.style.Stroke({
                        color: '#000000'
                    })
                }

                return [new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 18,
                        fill: new ol.style.Fill({
                            color: selectOwnerColor(owners)
                        }),
                        stroke: stroke
                    }),
                    text: new ol.style.Text({
                        text: owners,
                        size: 30,
                        fill: new ol.style.Fill({
                            color: '#FFFFFF'
                        })
                    })
                })]
            }
        ));
    }

    var layerMonitoringName = 'monitoring';

    var layerMonitoring = self.getLayerByName(layerMonitoringName);
    if (!layerMonitoring) {
        self.addLayer(layerMonitoringName, self.createVectorLayer(
            function (feature, r) {
                var styles = [];
                var props = feature.getProperties();
                var geometry = feature.getGeometry();

                geometry.forEachSegment(function(start, end) {
                    styles.push(new ol.style.Style({
                        geometry: new ol.geom.Point(end),
                        fill: new ol.style.Fill({
                            color: 'red'
                        }),
                        image: new ol.style.Circle({
                            radius: 3,
                            fill: new ol.style.Fill({
                                color: 'green'
                            })
                        })
                    }))
                });

                if (props && props['last_point']) {
                    styles.push(new ol.style.Style({
                        geometry: new ol.geom.Point(self.transform(props['last_point'])),
                        image: self.createIconStyle(icon_truck, 16, 16)
                    }));
                }
                return styles
            }
        ));
    }

    self.setLayerVisible(layer_owners, false);

    var cluster1 = self.enableCluster({
        sourceName: sskLayerName,
        distance: 45
    });

    var cluster2 = self.enableCluster({
        sourceName: codLayerName,
        distance: 45
    });

    var cluster3 = self.enableCluster({
        sourceName: cippLayerName,
        distance: 45
    });

    var cluster4 = self.enableCluster({
        sourceName: layer_owners,
        distance: 45
    });
};

