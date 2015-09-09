var ClickModule = function (options) {
    options = options || {};
    var self = this;
    this.olmm = options['olmm'];
    this.callbacks = [];
    this.olmm.map.on('singleclick', this.handleClickFunction.bind(self));
};

ClickModule.prototype.handleClickFunction = function (event) {
    var self = this;
    var features = [];
    var layerFeaturesMap = {};

    self.olmm.map.forEachFeatureAtPixel(event.pixel, function(feature, layer){

        var layerName;
        var layerObj;

        for (layerName in self.olmm.layers) {
            layerObj = self.olmm.layers[layerName];
            if (layerObj == layer) {
                break;
            }
        }

        features.push(feature);

        if (!layerFeaturesMap[layerName]) {
            layerFeaturesMap[layerName] = []
        }

        layerFeaturesMap[layerName].push(feature)
    });

    self.callbacks.forEach(function(callbackData){  // simpleclick
        var callback = callbackData['fn'];
        var params = callbackData['params'] || {};

        if (!!params) {
            var layerName = params['layerName'];
            var featureType = params['featureType'];
            var featureProperties = params['featureProperties'];

            if (layerName) {
                features = layerFeaturesMap[layerName] || [];
            }

            if (featureType) {
                features = features.filter(function(feature){
                    return feature.getGeometry().getType() === featureType
                })
            }
        }

        if (features.length > 0) {
            callback.call(self.olmm, event, features[0]);
        }
    });
};


OLMM.prototype.enableClickInteraction = function () {
    var self = this;
    self.clickApp = new ClickModule({'olmm': self})
};


OLMM.prototype.addClickFunction = function (fn, params) {
    this.clickApp.callbacks.push({'fn': fn, 'params': params})
};


OLMM.prototype.addMapClickFunction = function (handleMapClickFunction) {
    this.map.on('singleclick', handleMapClickFunction)
};

OLMM.prototype.addOnceMapClickFunction = function (handleMapClickFunction) {
    this.map.once('singleclick', handleMapClickFunction)
};

OLMM.prototype.addFeatureClickFunction = function(handleFeatureClickFunction, layer_name) {
    var olmm = this;

    olmm.map.on('singleclick', function (event) {
        var feature = this.getFeatureAtPixel(event.pixel, olmm.getLayerByName(layer_name));
        if (feature) {
            handleFeatureClickFunction(event, feature.getMainDataWithCloneAndTransform());
        }
    });
};

OLMM.prototype.getClickCoordinatesLonLat = function(event) {
    return this.transform_to_lot_lan(event.coordinate)
};

OLMM.prototype.unSelectFeatures = function (source_name, default_state) {
    var state = default_state || '';

    this.getSourceByName(source_name).getFeatures().map(
        function(feature){
            feature.setProperties({'priorityState': state});
            feature.changed();
        }
    );
};

OLMM.prototype.addContextMenuClickFunction = function(handleFunction) {
    var self = this;
    var map = self.map;

    map.getViewport().addEventListener('contextmenu', function (e) {
        return handleFunction(e, self.transform_to_lot_lan(self.map.getEventCoordinate(e)))
    })
};
