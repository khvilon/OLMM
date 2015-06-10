OLMM.prototype.deleteFeatureFromLayer = function(event) {

    var self = this;
    var layer = self._layerForDelete;

    var source = layer.getSource();

    var feature = self.forEachFeatureAtPixel(
        event.pixel,
        function(feature, layer) {
            return feature;
        }
    );

    if (feature) {
        var id = feature.getId();
        console.log(id);
        source.removeFeature(feature);
    }
};

OLMM.prototype.enableDeleteMode = function(layer_name) {
    var self = this;

    self.map._layerForDelete = self.getLayerByName(layer_name);
    self.map.addEventListener('singleclick', self.deleteFeatureFromLayer);
};

OLMM.prototype.disableDeleteMode = function() {
    var self = this;

    self.map._layerForDelete = undefined;
    self.map.removeEventListener('singleclick', self.deleteFeatureFromLayer);
};

