function OLMM() {
    this.layers = {};
    this.sources = {};
    this.firstLayers = [];
    this.interactions = {};
    this.styles = {};
    this.config = {};
}

(function (module) {

    module.createMap = function (divName) {
        this.map = new ol.Map({
            target: divName,
            layers: this.firstLayers,
            view: new ol.View({
                projection: 'EPSG:3857',
                center: [4188115.1089405594,7509151.488234565],
                zoom: 11
            })
        });
    };

    module.deleteFeatureById = function(source_name, feature_id) {
        var source = this.getSourceByName(source_name);
        var feature = source.getFeatureById(feature_id);
        source.removeFeature(feature);
    };

    module.init = function (divName) {
        this.createMap(divName);
    };

    module.getInteractionsByName = function(name) {
        return this.interactions[name];
    };

    module.deleteInteractionsByName = function(name) {
        var self = this;

        var interaction = self.interactions[name];

        interaction.setActive(false);
        self.map.removeInteraction(interaction);

        delete self.interactions[name];
    };

    module.getLayerByName = function(name) {
        return this.layers[name];
    };

    module.getSourceByName = function(name) {
        return this.sources[name];
    };

    module.getStyleByName = function (name) {
        return this.styles[name];
    };

    module.addInteraction = function(name, interaction) {
        this.interactions[name] = interaction;
        this.map.addInteraction(interaction);
    };

    module.addSource = function(name, source) {
        this.sources[name] = source
    };

    module.addStyle = function(name, style) {
        this.styles[name] = style
    };

    module.addLayer = function(name, layer) {
        this.layers[name] = layer;
        this.addSource(name, layer.getSource());
        if(this.map) {
            this.map.addLayer(layer);
        }
        else {
            this.firstLayers.push(layer);
        }
    };

    module.setLayerVisible = function(layer_name, visible) {
        this.getLayerByName(layer_name).setVisible(visible);
    };

    module.toggleLayerVisible = function(layer_name) {
        var self = this;
        var layer = this.getLayerByName(layer_name);
        var new_layer_visible = !layer.getVisible();
        self.setLayerVisible(layer_name, new_layer_visible);
        return new_layer_visible;
    };

    module.attachAddCallback = function (callback) {
        this.config['add_callback'] = callback;
    }

    module.attachEditCallback = function (callback) {
        this.config['edit_callback'] = callback;
    }

    module.attachDragCallback = function (callback) {
        this.config['drag_callback'] = callback;
    }

    module.attachDeleteCallback = function (callback) {
        this.config['delete_callback'] = callback;
    }

})(OLMM.prototype);
