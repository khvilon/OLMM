OLMM.prototype.deleteFeatureFromLayer = function(event) {

    var map = this;
    var layer = map._layerForDelete;
    var deleteCallBack = map._deleteCallBacks;

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

        deleteCallBack.map(function(callback){
            callback(event, feature.getMainDataWithCloneAndTransform())
        });
    }

    return false;
};

OLMM.prototype.removeFeatureById = function (featureId, source_name) {
    var self = this;
    var source = self.getSourceByName(source_name);
    var feature = source.getFeatureById(featureId);
    source.removeFeature(feature);
};

OLMM.prototype.enableDeleteMode = function(layer_name) {
    var self = this;

    self.disableActions();

    self.map._deleteCallBacks = self.getConfigValues('delete_callback');
    self.map._layerForDelete = self.getLayerByName(layer_name);
    self.map.addEventListener('singleclick', self.deleteFeatureFromLayer);
};

OLMM.prototype.disableDeleteMode = function() {
    var self = this;

    self.map._layerForDelete = undefined;
    self.map.removeEventListener('singleclick', self.deleteFeatureFromLayer);
};
