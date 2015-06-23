OLMM.prototype.createWayLayers = function(icon_src) {
    var self = this;

    self.addStyle('icon1', self.createIconStyle(icon_src));

    self.addLayer('osm', self.createOSMLayer());

    self.addLayer('ways', self.createVectorLayer(
        function (feature, resolution) {
            var featureStateMap = {
                true: 'red',
                false: 'blue'
            };

            var featureState = feature.getProperties()['federal'];
            var color = featureStateMap[featureState];

            var styles = [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: color,
                        width: 2
                    })
                })
            ];

            return styles;
        }
    ));

    self.addLayer('mark', self.createVectorLayer(self.getStyleByName('icon1')))
};

OLMM.prototype.waysGetCoordsForRequest = function () {
    var self = this;
    var coords = self.getViewPortCoords();

    var d = {
        lon0: coords[0][0],
        lat0: coords[0][1],
        lon1: coords[1][0],
        lat1: coords[1][1],
        type: 'nofed'
    };
    console.log(d);
    return d
};

OLMM.prototype.waysEnableDraw = function () {
    var self = this;
    self.enableDrawModeForPoint('mark');
    self.map.getViewport().style.cursor = 'pointer';
};

OLMM.prototype.initWayApp = function (icon_src) {

    olmm.init('map');
    olmm.createWayLayers(icon_src);

    var sel = function(event, data) {
        olmm.disableActions();
        return olmm.config['waysCallBackFunction'](data["coords"])
    };

    olmm.attachAddCallback(sel);
};
