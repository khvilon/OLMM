OLMM.prototype.createTSOLayers = function(icon_src, wmsLayers) {
    var self = this;

    self.addStyle('icon1', self.createIconStyle(icon_src));

    self.loadWMSLayers(wmsLayers);

    self.addLayer('tso', self.createVectorLayer(
        function (feature, resolution) {
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
    ));

    self.addLayer('mark', self.createVectorLayer(self.getStyleByName('icon1')))
};

OLMM.prototype.tsoEnableDraw = function () {
    var self = this;
    self.enableDrawModeForPoint('mark');
    self.makePointerCursor();
};

OLMM.prototype.initTSOApp = function (options) {
    options = options || {};
    var icon_url = options['icon'];
    var callback = options['callback'];
    var wmsLayers = options['wmsLayers'];
    var mapOptions = options['mapOptions'];

    var self = this;
    self.createMap(mapOptions);

    self.createTSOLayers(icon_url, wmsLayers);

    var sel = function(event, data) {
        self.disableActions();
        return callback(data["coords"])
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

OLMM.prototype.tsoMakePoint = function (lon, lat) {
    return this.makePointFromLonLat(lon, lat, 'mark')
};
