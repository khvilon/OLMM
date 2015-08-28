OLMM.prototype.initUraganApp = function (options) {
    var self = this;

    options = options || {};

    var styleFunction = function (feature, resolution) {

        if (feature.getGeometry().getType() == 'Point') {
            var pointStyleName = 'basePointStyleName';
            var pointStyle = self.getStyleByName(pointStyleName);
            if (!pointStyle) {
                pointStyle = new ol.style.Style({
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
                });
                self.addStyle(pointStyleName, pointStyle)
            }
            return [pointStyle];
        } else {
            var lineStyleName = 'baseLineStyleName';
            var lineStyle = self.getStyleByName(lineStyleName);
            if (!lineStyle) {
                lineStyle = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: feature.getProperties()['color'] || 'green',
                        width: 3
                    })
                });
                self.addStyle(lineStyleName, lineStyle)
            }
            return [lineStyle];
        }
    };

    self.createMap();

    var osm_layer = {
        'layer_name': 'osm',
        'wms_conf': {'url': 'http://svp-gis-frontend-1.svp.prod/mapcache/', 'layers': 'osm'}
    };

    //self.loadWMSLayers([osm_layer]);
    self.addLayer('osm', self.createOSMLayer());

    var layerName = 'edit';
    self.setDefaultSourceName(layerName);

    self.addLayer(layerName, self.createVectorLayer(styleFunction));

    self.addFeatureClickFunction(function(event, featureData) {
        if (featureData.type == 'Point') {
            return options['featureClickFunction'](event, featureData)
        }
    }, layerName);

    self.enableHoverMode(undefined, self.pointName);

};
