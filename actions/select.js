OLMM.prototype.initLayersForHoverEvent = function(layers) {
    this.layers_for_hover_event = layers;
};

OLMM.prototype.addSelectOnHoverEvent = function(selector, layers) {
    var olmm = this;
    $(selector).mouseenter(function (event) {
        olmm.selectOnHover(event.target);
    });
};

OLMM.prototype.addUnselectOnHoverEvent = function(selector) {
    var olmm = this;
    $(selector).mouseout(function(event){
        olmm.unselectOnHover(event.target);
    })
};

OLMM.prototype.selectOnHover = function(event_target) {
    var source;
    var features_to_select = [];
    var way_id = $(event_target).data('way-id');
    var layers = this.layers_for_hover_event;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        layer.setOpacity(0.2)
    }
};

OLMM.prototype.unselectOnHover = function() {
    var layers = this.layers_for_hover_event;

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        layer.setOpacity(1)
    }
};
