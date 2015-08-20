OLMM.prototype.deleteFeatureFromLayer = function(event) {
    var map = this;
    var layer = map._layerForDelete;
    var deleteCallBack = map._deleteCallBacks;

    if (!layer) {
        return
    }

    var source = layer.getSource();

    var feature = map.getFeatureAtPixel(event.pixel, layer);
    if (feature) {
        source.removeFeature(feature);

        deleteCallBack.map(function(callback){
            callback(event, feature.getMainDataWithCloneAndTransform())
        });
    }

    return false;
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

OLMM.prototype.attachDeleteCallback = function (callback) {
    this.addToConfig('delete_callback', callback);
};