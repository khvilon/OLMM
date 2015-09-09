OLMM.prototype.initSMKApp = function (options) {
    var self = this;

    options = options || {};
    var callback = options['callback'];
    var icon = options['icon'];
    var wmsLayers = options['wmsLayers'];
    var waysColors = options['waysColors'];
    var mapOptions = options['mapOptions'];

    self.lastDrawPointId = null;

    self.createMap(mapOptions);
    self.createSMKLayers(wmsLayers, waysColors);
    self.setDefaultSourceName('points');

    self.config['smkCallBackFunction'] = callback;

    var sel = function(event, data) {

        var color = self.getConfigValue('pointColor') || '';
        var text = self.getConfigValue('pointText') || '';
        var textColor = self.getConfigValue('pointTextColor') || '';
        var textSize = self.getConfigValue('pointTextSize') || '';
        var pointRadius = self.getConfigValue('pointRadius') || '';

        event.feature.setProperties({
            "color": color,
            "text": text,
            "textColor": textColor,
            "textSize": textSize,
            "pointRadius": pointRadius
        });

        if (self.lastDrawPointId) {
            self.deleteFeatureById(self.lastDrawPointId)
        }
        self.lastDrawPointId = data.id;
        return self.config['smkCallBackFunction'](data["coords"])
    };

    self.attachAddCallback(sel);

    self.addStyle('draw_style', new ol.style.Style({
        image: new ol.style.Circle({
            radius: 1,
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

OLMM.prototype.clearMap = function () {
    var self = this;
    self.lastDrawPointId = null;
    self.clearSources();
};

OLMM.prototype.createSMKLayers = function(wmsLayers, waysColors) {
    var self = this;

    if (!wmsLayers) {
        wmsLayers = [{
            'layer_name': 'osm',
            'wms_conf': {'url': 'http://10.0.2.60/mapcache/', 'layers': 'osm', 'visible': true}
        }, {
            'layer_name': 'froad',
            'wms_conf': {'url': 'http://map.prod.svp12.ru/', 'layers': 'froad', 'visible': true}
        }];
    }

    self.loadWMSLayers(wmsLayers);

    self.addLayer('ways', self.createVectorLayer(
        function (feature, resolution) {
            return [new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: feature.getProperties()['color'] || 'black',
                    width: 5
                })
            })]
        }

    ));

    self.addLayer('points', self.createVectorLayer(
        function (feature, resolution) {
            var featureProperties = feature.getProperties();
            var color = 'black';
            var text = '';
            var textSize = 14;
            var textColor = 'black';
            var pointRadius = 6;
            var icon;

            if (featureProperties) {

                if (featureProperties['text']) {
                    text = featureProperties['text']
                }

                if (featureProperties['color']) {
                    color = featureProperties['color']
                }

                if (featureProperties['textColor']) {
                    textColor = featureProperties['textColor']
                }

                if (featureProperties['textSize']) {
                    textSize = featureProperties['textSize']
                }

                if (featureProperties['pointRadius']) {
                    pointRadius = featureProperties['pointRadius']
                }

                if (featureProperties['icon']) {
                    icon = featureProperties['icon']
                }

            }

            var imageStyle;
            if (icon) {
                imageStyle = self.createBaseIconStyle(icon)
            } else {
                imageStyle = new ol.style.Circle({
                    radius: pointRadius,
                    fill: new ol.style.Fill({
                        color: color
                    })
                })
            }

            return [
                new ol.style.Style({
                    image: imageStyle,
                    text: new ol.style.Text({
                        text: text,
                        size: textSize,
                        fill: new ol.style.Fill({
                            color: textColor
                        }),
                        stroke: new ol.style.Stroke({
                            color: textColor
                        })
                    })
                })
            ]
        }
    ))
};

OLMM.prototype.smkEnableDraw = function () {
    var self = this;
    self.enableDrawModeForPoint('points');
    self.makePointerCursor();
};

OLMM.prototype.smkMakePoint = function (lon, lat) {
    var self = this;
    if (self.lastDrawPointId) {
        var feature = self.getSourceByName(self.getDefaultSourceName()).getFeatureById(self.lastDrawPointId);
        feature.moveToLonLat(lon, lat)
    } else {
        var feature = self.makePointFromLonLat(lon, lat, self.getDefaultSourceName());
        var id = feature.setRandomId();
    }

    var color = self.getConfigValue('pointColor') || '';
    var text = self.getConfigValue('pointText') || '';
    var textColor = self.getConfigValue('pointTextColor') || '';
    var textSize = self.getConfigValue('pointTextSize') || '';
    var pointRadius = self.getConfigValue('pointRadius') || '';

    feature.setProperties({
        "color": color,
        "text": text,
        "textColor": textColor,
        "textSize": textSize,
        "pointRadius": pointRadius
    });

    self.lastDrawPointId = feature.getId();
    self.fitToFeature(feature);
    self.smkEnableDraw();

    return feature
};
