OLMM.prototype.addMapClickFunction = function (handleMapClickFunction) {
    this.map.on('singleclick', handleMapClickFunction)
};

OLMM.prototype.addOnceMapClickFunction = function (handleMapClickFunction) {
    this.map.once('singleclick', handleMapClickFunction)
};

OLMM.prototype.addFeatureClickFunction = function(handleFeatureClickFunction, layer_name) {
    var layer_obj;
    var olmm = this;

    olmm.map.on('singleclick', function (event) {
        if (layer_name) {
            layer_obj = olmm.getLayerByName(layer_name);
        }
        var feature = this.forEachFeatureAtPixel(event.pixel,
            function (feature, layer) {
                if (layer_obj) {
                    if (layer == layer_obj) {
                        return feature;
                    }
                } else {
                    return feature
                }
            });
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
        return handleFunction(e, olmm.transform_to_lot_lan(olmm.map.getEventCoordinate(e)))
    })
};
