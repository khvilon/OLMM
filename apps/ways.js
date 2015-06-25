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

OLMM.prototype.waysEnableDraw = function () {
    var self = this;
    self.enableDrawModeForPoint('mark');
    self.makePointerCursor();
};

OLMM.prototype.initWayApp = function (icon_src) {
    olmm.init('map');
    olmm.createWayLayers(icon_src);

    var sel = function(event, data) {
        olmm.disableActions();
        return olmm.config['waysCallBackFunction'](data["coords"])
    };

    olmm.attachAddCallback(sel);

    olmm.addStyle('draw_style', new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'transparent'
            })
        })
    }))
};
