OLMM.prototype.deleteFeatureFromLayer = function(event) {

    var map = this;
    var layer = map._layerForDelete;
    var deleteCallback = map._deleteCallback;

    if (!layer) {
        return
    }

    var source = layer.getSource();

    var feature = map.forEachFeatureAtPixel(
        event.pixel,
        function(feature, l) {
            if (feature && l == layer) {
                return feature
            }
        }
    );

    if (feature) {
        source.removeFeature(feature);
        deleteCallback(event, feature);
    }

    return false;
};

OLMM.prototype.enableDeleteMode = function(layer_name) {
    var self = this;

    self.disableActions();
    self.disableDefaultInteractions();

    self.map._deleteCallback = self.config['delete_callback'];
    self.map._layerForDelete = self.getLayerByName(layer_name);
    self.map.addEventListener('singleclick', self.deleteFeatureFromLayer);
};

OLMM.prototype.disableDeleteMode = function() {
    var self = this;

    self.map._layerForDelete = undefined;
    self.map.removeEventListener('singleclick', self.deleteFeatureFromLayer);
};
