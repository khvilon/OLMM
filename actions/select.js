OLMM.prototype.addSelectOnHoverEvent = function(selector, sources) {
    $(selector).mouseenter(function (event) {
        olmm.selectOnHover(event.target, sources);
    });
};

OLMM.prototype.addUnselectOnHoverEvent = function(selector) {
    $(selector).mouseout(function(event){
        olmm.unselectOnHover(event.target);
    })
};


OLMM.prototype.selectOnHover = function(event_target, sources) {
    var source;
    var break_loop = false;
    var feature = '';
    var feature_id = $(event_target).data('feature-id');

    for (var i = 0; i < sources.length && !break_loop; i++) {
        source = sources[i];

        feature = source.getFeatureById(feature_id);

        if (feature) {
            break_loop = true
        }
    }

    this.hoverInteraction = new ol.interaction.Select();

    this.map.addInteraction(this.hoverInteraction);

    var features = this.hoverInteraction.getFeatures();

    features.push(feature);
};

OLMM.prototype.unselectOnHover = function(event_target) {
    var features = this.hoverInteraction.getFeatures();

    for (var i = 0; i < features.getLength(); i++) {
        features.pop()
    }
};
