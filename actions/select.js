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
    var layer_name = $(event_target).data('layer-name');
    var layers = this.layers_for_hover_event;

    this.getLayerByName(layer_name).setOpacity(0.1);
};

OLMM.prototype.unselectOnHover = function() {
    for (layer_name in this.layers) {
        this.getLayerByName(layer_name).setOpacity(1)
    }
};
