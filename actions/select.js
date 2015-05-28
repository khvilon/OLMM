OLMM.prototype.initLayersForHoverEvent = function(layers) {
    var layer, i;
    this.layers_for_hover_event = [];

    for (i = 0; i < layers.length; i++) {
        layer = layers[i];
        layer.setOpacity(0.3);
        this.layers_for_hover_event.push(layer);
    }
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
    console.log(this.layers_for_hover_event);
    var layer_name = $(event_target).data('layer-name');
    this.getLayerByName(layer_name).setOpacity(1);
};

OLMM.prototype.unselectOnHover = function() {
    for (var i = 0; i < this.layers_for_hover_event.length; i++) {
        this.layers_for_hover_event[i].setOpacity(0.3)
    }
};
