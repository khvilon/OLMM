OLMM.prototype.enableEditMode = function(layer_name) {
    var self = this;
    var layer = self.getLayerByName(layer_name);

    if (Object.keys(this.interactions).length > 0) {
        this.interactions.map(function(interaction){
            interaction.setActive(true)
        })
    } else {
        var select = new ol.interaction.Select();
        var features = select.getFeatures();

        var modify = new ol.interaction.Modify({
            features: features
        });

        features.on('add', function(event) {
            var feature = event.element;
            feature.on('change', function(event) {
                console.log('1');
            });
        });

        this.map.addInteraction(select);
        this.map.addInteraction(modify);
        this.interactions = [modify, select];
    }
};

OLMM.prototype.disableEditMode = function() {
    this.interactions.map(function(interaction){
        interaction.setActive(false)
    })
};
