function OLMM() {
    this.layers = {};
    this.sources = {};
    this.firstLayers = [];
    this.styles = {};
    this.config = {
        'add_callback': [],
        'edit_callback': [],
        'delete_callback': [],
        'drag_callback': []
    };
    this.select = null;
    this.interaction = null;
}

(function (module) {

    module.createMap = function (divName) {
        this.map = new ol.Map({
            target: divName,
            layers: this.firstLayers,
            view: new ol.View({
                projection: 'EPSG:3857',
                center: [4188115.1089405594,7509151.488234565],
                zoom: 11,
                maxZoom: 26,
                minZoom: 3
            })
        });
    };

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

    module.addInteraction = function (interaction) {
        this.interaction = interaction;
        this.map.addInteraction(interaction);
    };

    module.getInteraction = function () {
        return this.interaction
    };

    module.removeInteraction = function () {
        var interaction = this.getInteraction();
        if (interaction) {
            interaction.setActive(false);
            this.map.removeInteraction(interaction);
            this.select = null
        }
    };

    module.deleteFeatureById = function (source_name, feature_id) {
        var source = this.getSourceByName(source_name);
        var feature = source.getFeatureById(feature_id);
        source.removeFeature(feature);
    };

    module.init = function (divName) {
        this.createMap(divName);
    };

    module.getLayerByName = function(name) {
        return this.layers[name];
    };

    module.getSourceByName = function(name) {
        return this.sources[name];
    };

    module.addSource = function(name, source) {
        this.sources[name] = source
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

    module.addToConfig = function (key, value) {
        var self = this;
        var config_value = self.config[key];

        if (config_value instanceof Array) {
            config_value.push(value)
        } else if (!!config_value) {
            if (config_value instanceof Array) {
                self.config[key].push(value);
            } else {
                self.config[key] = [config_value, value];
            }
        } else {
            self.config[key] = value
        }
    };

    module.getConfigValue = function (name) {
        return this.config[name]
    };

    module.getConfigValues = function (name) {
        var values = this.config[name];

        if (!values) {return []}

        if (values instanceof Array) {
            return values
        } else {
            return [values]
        }
    };

    module.readConfig = function (config) {
        var self = this;
        for (var name in config) {
            self.addToConfig(name, config[name]);
        }
    };

    module.attachAddCallback = function (callback) {
        this.addToConfig('add_callback', callback);
    };

    module.attachEditCallback = function (callback) {
        this.addToConfig('edit_callback', callback);
    };

    module.attachDragCallback = function (callback) {
        this.addToConfig('drag_callback', callback);
    };

    module.attachDeleteCallback = function (callback) {
        this.addToConfig('delete_callback', callback);
    };

})(OLMM.prototype);
