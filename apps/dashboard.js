OLMM.prototype.initDashboardApp = function (options) {
    var self = this;

    options = options || {};
    var carIconSrc = options['carIconSrc'];
    var callback = options['callback'];
    var defaultSourceName = 'main';

    var osm_layer = {
        'layer_name': 'osm',
        'wms_conf': {'url': 'http://10.0.2.60:80/mapcache/', 'layers': 'osm'}
    };

    self.loadWMSLayers([osm_layer]);

    self.lastDrawPointId = null;
    self.setDefaultSourceName(defaultSourceName);
    self.createMap();

    var featureStateMap = {
        1: 'carIcon',
        0: 'simpleIcon'
    };

    self.addStyle('carIcon', self.createIconStyle(carIconSrc));

    self.addStyle('simpleIcon', new ol.style.Style({
        image: new ol.style.Circle({
            radius: 4,
            fill: new ol.style.Fill({
                color: 'red'
            })
        })
    }));

    self.addStyle('way', new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#009933',
            width: 3
        })
    }));

    self.addLayer(defaultSourceName, self.createVectorLayer(
        function (feature, resolution) {
            var styleName;

            if (feature.getGeometry().getType() == 'Point') {
                styleName = featureStateMap[feature.getProperties()['type'] || 0];
            } else {
                styleName = 'way';
            }

            return [self.getStyleByName(styleName)];
        }
    ));
};