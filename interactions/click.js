OLMM.prototype.addMapClickFunction = function (handleMapClickFunction) {
    this.map.on('singleclick', handleMapClickFunction)
};

OLMM.prototype.addOnceMapClickFunction = function (handleMapClickFunction) {
    this.map.once('singleclick', handleMapClickFunction)
};

OLMM.prototype.addFeatureClickFunction = function(handleFeatureClickFunction, layer_name) {
    var olmm = this;
    var layer;
    if (layer_name) {
        layer = olmm.getLayerByName(layer_name);
    }

    olmm.map.on('singleclick', function (event) {
        var feature = this.getFeatureAtPixel(event.pixel, layer);
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
