(function (module) {

    module.addSelect = function (select) {
        this.select = select;
        this.map.addInteraction(select);
    };

    module.getSelect = function () {
        return this.select
    };

    module.disableSelect = function () {
        var interaction = this.getSelect();
        if (interaction) {
            interaction.getFeatures().clear();
        }
    };

    module.removeSelect = function () {
        this.disableSelect();
        var interaction = this.getSelect();
        if (interaction) {
            this.map.removeInteraction(interaction);
            this.select = null
        }
    };

    module.initLayersForHoverEvent = function(layers) {
        var layer, i;
        this.layers_for_hover_event = [];

        for (i = 0; i < layers.length; i++) {
            layer = layers[i];
            layer.setOpacity(0.3);
            this.layers_for_hover_event.push(layer);
        }
    };

    module.addSelectOnHoverEvent = function(selector, layers) {
        var olmm = this;
        $(selector).mouseenter(function (event) {
            olmm.selectOnHover(event.target);
        });
    };

    module.addUnselectOnHoverEvent = function(selector) {
        var olmm = this;
        $(selector).mouseout(function(event){
            olmm.unselectOnHover(event.target);
        })
    };

    module.selectOnHover = function(event_target) {
        var layer_name = $(event_target).data('layer-name');
        this.getLayerByName(layer_name).setOpacity(1);
    };

    module.unselectOnHover = function() {
        this.layers_for_hover_event.map(function(l){l.setOpacity(0.3)});
    };

})(OLMM.prototype);
