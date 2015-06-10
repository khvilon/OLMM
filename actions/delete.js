OLMM.prototype.deleteFeatureFromLayer = function(event) {

    console.log(layer_name);
    console.log(event);

    console.log(this);

    var self = this;
    var layer_name = self._layerForDelete;

    self.disableDeleteModeForAll();

    var source = self.getLayerByName(layer_name).getSource();

    var feature = self.map.forEachFeatureAtPixel(
        event.pixel,
        function(feature, layer) {
            return feature;
        }
    );

    console.log(feature);

    if (feature) {
        var id = feature.getId();
        console.log(id);
        source.removeFeature(feature);
    }
};

OLMM.prototype.enableDeleteMode = function(layer_name) {
    this._layerForDelete = layer_name;
    this.map.addEventListener('singleclick', this.deleteFeatureFromLayer);
};

OLMM.prototype.disableDeleteMode = function() {
    this.map.removeEventListener('singleclick', this.deleteFeatureFromLayer);
};

OLMM.prototype.disableDeleteModeForAll = function() {
    var self = this;
    for (layer_name in self.layers) {
        self.map.removeEventListener('singleclick', self.deleteFeatureFromLayer.bind(self, layer_name));
    }
};
