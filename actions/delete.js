OLMM.prototype.deleteFeatureFromLayer = function(event) {

    var map = this;
    var layer = map._layerForDelete;

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
        console.log('hello');
        source.clear();
        source.removeFeature(feature);
        map.config['delete_callback'](event, feature.getId());
    }

    return false;
};

OLMM.prototype.enableDeleteMode = function(layer_name) {
    var self = this;
    self.map.config = self.config; // TODO hack ;(

    self.disableInteractions();

    self.map._layerForDelete = self.getLayerByName(layer_name);
    self.map.addEventListener('singleclick', self.deleteFeatureFromLayer);
};

OLMM.prototype.disableDeleteMode = function() {
    var self = this;

    self.map._layerForDelete = undefined;
    self.map.removeEventListener('singleclick', self.deleteFeatureFromLayer);
};
