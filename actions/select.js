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
    var features_to_select = [];
    var way_id = $(event_target).data('way-id');

    for (var i = 0; i < sources.length && !break_loop; i++) {
        source = sources[i];

        var features = source.getFeatures();

        for (var j = 0; j < features.length; j++) {

            var feature_properties = features[j].getProperties();

            if (feature_properties['way_number'] == way_id) {
                features_to_select.push(features[j])
            }
        }
    }

    this.hoverInteraction = new ol.interaction.Select();

    this.map.addInteraction(this.hoverInteraction);

    var features = this.hoverInteraction.getFeatures();

    features.push(features_to_select[6]);

    //for (var k = 0; k < features_to_select.length; k++){
    //    features.push(features_to_select[i])
    //}
};

OLMM.prototype.unselectOnHover = function(event_target) {
    var features = this.hoverInteraction.getFeatures();

    for (var i = 0; i < features.getLength(); i++) {
        features.pop()
    }
};
