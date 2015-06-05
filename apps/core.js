function OLMM() {
    this.layers = {};
    this.sources = {};
    this.firstLayers = [];
    this.interactions = {};
    this.styles = {};
}

(function (module) {

    module.createMap = function (divName) {
        this.map = new ol.Map({
            target: divName,
            layers: this.firstLayers,
            view: new ol.View({
                center: [0, 0],
                zoom: 10
            })
        });
    };

    module.deleteFeatureById = function(source_name, feature_id) {
        var source = this.getSourceByName(source_name);
        var feature = source.getFeatureById(feature_id);
        source.removeFeature(feature);

        console.log(feature.getProperties()['projections'])
    };

    module.init = function (divName) {
        this.createMap(divName);
    };

    module.getInteractionsByName = function(name) {
        return this.interactions[name];
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
        this.interactions[name] = interaction
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

})(OLMM.prototype);
