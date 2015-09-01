OLMM.prototype.createWayLayers = function(icon_src) {
    var self = this;

    self.addStyle('icon1', self.createIconStyle(icon_src));

    var osm_layer = [{
        'layer_name': 'osm',
        'wms_conf': {'url': 'http://10.0.2.60/mapcache/', 'layers': 'osm', 'visible': true}
    }];

    self.loadWMSLayers(osm_layer);


    self.addLayer('ways', self.createVectorLayer(
        function (feature, resolution) {
            var featureStateMap = {
                true: 'red',
                false: '#009933'
            };

            var featureState = feature.getProperties()['federal'];
            var color = featureStateMap[featureState];

            var styles = [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: color,
                        width: 5
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
    var self = this;
    self.createMap();
    self.createWayLayers(icon_src);

    var sel = function(event, data) {
        self.disableActions();
        return self.config['waysCallBackFunction'](data["coords"])
    };

    self.attachAddCallback(sel);

    self.addStyle('draw_style', new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'transparent'
            })
        })
    }))
};