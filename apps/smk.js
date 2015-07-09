OLMM.prototype.initSMKApp = function (options) {
    var self = this;

    options = options || {};
    var icon = options['icon'];
    var callback = options['callback'];

    self.lastDrawPointId = null;

    self.addStyle('icon1', self.createIconStyle(icon));

    self.createMap();
    self.createSMKLayers(icon);
    self.setDefaultSourceName('points');
    self.config['smkCallBackFunction'] = callback;

    var sel = function(event, data) {
        if (self.lastDrawPointId) {
            self.deleteFeatureById(self.lastDrawPointId)
        }
        self.lastDrawPointId = data.id;
        return self.config['smkCallBackFunction'](data["coords"])
    };

    self.attachAddCallback(sel);

    self.addStyle('draw_style', new ol.style.Style({
        image: new ol.style.Circle({
            radius: 1   ,
            fill: new ol.style.Fill({
                color: 'transparent'
            })
        })
    }))
};

OLMM.prototype.disableDraw = function () {
    var self = this;
    self.lastDrawPointId = null;
    self.disableActions();
};

OLMM.prototype.createSMKLayers = function(icon_src) {
    var self = this;

    var osm_layer = [{
        'layer_name': 'osm',
        'wms_conf': {'url': 'http://10.0.2.60/mapcache/', 'layers': 'osm', 'visible': true}
    }];

    self.loadWMSLayers(osm_layer);

    self.addLayer('ways', self.createVectorLayer(
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#009933',
                width: 5
            })
        })
    ));

    self.addLayer('points', self.createVectorLayer(
        self.getStyleByName('icon1')
    ))
};

OLMM.prototype.smkEnableDraw = function () {
    var self = this;
    self.enableDrawModeForPoint('points');
    self.makePointerCursor();
};

OLMM.prototype.makePoint = function (lon, lat) {
    var feature = this.makePointFromLonLat(lon, lat, 'points');
    var id = feature.setRandomId();
    this.lastDrawPointId = id;
    this.smkEnableDraw();
};
