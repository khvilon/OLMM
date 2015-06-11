OLMM.prototype.addMapClickFunction = function (handleMapClickFunction) {
    this.map.on('singleclick', function (event) {
        handleMapClickFunction(event)
    });
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
            handleFeatureClickFunction(event, feature);
        }
    });
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
