OLMM.prototype.initTSOTempApp = function (options) {
    var self = this;

    var mapOptionsDev = {controls: false, interactions: false};

    options = options || {};
    var wmsLayers = options['wmsLayers'];
    var mapOptions = options['mapOptions'] || mapOptionsDev;
    var icon = options['icon'];

    var styleFunction = function (feature, resolution) {

        if (feature.getGeometry().getType() == 'Point') {
            var pointStyleName = 'basePointStyleName';
            var pointStyle = self.getStyleByName(pointStyleName);
            if (!pointStyle) {
                pointStyle = self.createIconStyle(icon);
                self.addStyle(pointStyleName, pointStyle)
            }
            return [pointStyle];
        } else {
            var featureStateMap = {
                true: 'red',
                false: '#009933'
            };

            var featureState = feature.getProperties()['federal'];
            var color = featureStateMap[featureState];

            return [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: color,
                        width: 5
                    })
                })
            ];
        }
    };

    self.createMap(mapOptions);
    self.loadWMSLayers(wmsLayers);

    var layerName = 'edit';
    self.setDefaultSourceName(layerName);

    self.addLayer(layerName, self.createVectorLayer(styleFunction));
};
