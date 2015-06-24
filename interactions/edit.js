OLMM.prototype.enableEditMode = function(layer_name) {
    var self = this;
    var select;

    self.disableActions();

    if (layer_name) {
        var layer = self.getLayerByName(layer_name);
        select = new ol.interaction.Select({
            layers: [layer]
        });
    } else {
        select = new ol.interaction.Select()
    }

    self.addSelect(select);

    var features = select.getFeatures();

    var modify = new ol.interaction.Modify({
        features: features
    });

    features.on('remove', function(event) {
        self.config['edit_callback'](event, event.element.getMainDataWithCloneAndTransform());
    });

    self.addInteraction(modify);
};
