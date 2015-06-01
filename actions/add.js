OLMM.prototype.enableAddMode = function(feature_type) {

    if (!(feature_type in ['Point', 'LineString', 'Polygon', 'Circle'])) {
        alert(feature_type+': not allowed');
        return;
    }

    this.disableAddMode();

    var cached_add_mode = this.getInteractionsByName(feature_type);

    if (cached_add_mode) {
        cached_add_mode.setActive(true)
    } else {
        var source = new ol.source.Vector();

        var draw = new ol.interaction.Draw({
            source: source,
            type: feature_type
        });

        this.addInteraction(feature_type, draw);
        this.map.addInteraction(draw);
    }

};

OLMM.prototype.disableAddMode = function() {
    this.interactions.each(function(){
        this.setActive(false)
    });
};
