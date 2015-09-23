OLMM.prototype.initDashboardApp = function (options) {
    var self = this;

    options = options || {};

    var callback = options['callback'];
    var carIconSrc = options['carIconSrc'];
    var tdrIconSrc = options['tdrIconSrc'];
    var wmsLayers = options['wmsLayers'];
    var mapOptions = options['mapOptions'] || {};
    var defaultSourceName = 'main';

    self.loadWMSLayers(wmsLayers);

    self.setDefaultSourceName(defaultSourceName);
    self.createMap();

    self.addForceToConfig('carIconAnchorX', 4);
    self.addForceToConfig('carIconAnchorY', 8);
    self.addForceToConfig('tdrIconAnchorX', 8);
    self.addForceToConfig('tdrIconAnchorY', 16);

    self.addStyle(
        'car', self.createIconStyle(
            carIconSrc, self.getConfigValue('carIconAnchorX'), self.getConfigValue('carIconAnchorY')
        )
    );

    self.addStyle(
        'tdr', self.createIconStyle(
            tdrIconSrc, self.getConfigValue('tdrIconAnchorX'), self.getConfigValue('tdrIconAnchorY')
        )
    );

    self.addStyle('way', new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#009933',
            width: 3
        })
    }));

    self.addLayer(defaultSourceName, self.createVectorLayer(
        function (feature, resolution) {
            if (feature.isPoint()) {
                return [self.getStyleByName(feature.getProperties()['type'])]
            } else {
                return [self.getStyleByName('way')];
            }
        }
    ));
};
