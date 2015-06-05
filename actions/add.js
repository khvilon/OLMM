OLMM.prototype.enableAddMode = function(feature_type, source_name) {
    var self = this;

    if (['Point', 'LineString', 'Polygon', 'Circle'].indexOf(feature_type) == -1) {
        alert(feature_type+': not allowed');
        return;
    }

    this.disableAddMode();

    var cached_add_mode = this.getInteractionsByName(feature_type);

    if (cached_add_mode) {
        cached_add_mode.setActive(true)
    } else {

        var layer = self.createVectorLayer();
        self.addLayer('draw', layer);
        var source = self.getSourceByName('draw');

        var draw = new ol.interaction.Draw({
            source: source,
            type: feature_type
        });

        this.addInteraction(feature_type, draw);
        this.map.addInteraction(draw);
    }
};

OLMM.prototype.disableAddMode = function() {
    for (var interaction_name in this.interactions) {
        this.interactions[interaction_name].setActive(false)
    }
};
