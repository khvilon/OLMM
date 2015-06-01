OLMM.prototype.addMapClickFunction = function (handleMapClickFunction) {
    this.map.on('singleclick', function (event) {
        handleMapClickFunction(event)
    });
};

OLMM.prototype.addFeatureClickFunction = function(handleFeatureClickFunction, layer_name) {
    var layer_obj;

    if (layer_name) {
        layer_obj = this.getLayerByName(layer_name);
    }
    this.map.on('singleclick', function (event) {
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
            console.log(feature.getId());
            handleFeatureClickFunction(event, feature.getId());
        }
    });
};
