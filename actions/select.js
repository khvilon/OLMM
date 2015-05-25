OLMM.prototype.addSelectOnHoverEvent = function(selector, source) {
    $(selector).mouseenter(function (event) {
        olmm.selectOnHover(event.target, source);
    });
};

OLMM.prototype.addUnselectOnHoverEvent = function(selector) {
    $(selector).mouseout(function(event){
        olmm.unselectOnHover(event.target);
    })
};


OLMM.prototype.selectOnHover = function(event_target, source) {
    var feature = source.getFeatureById($(event_target).data('feature-id'));

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
