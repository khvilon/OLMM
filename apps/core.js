function OLMM() {
    this.layers = {};
    this.sources = {};
    this.firstLayers = [];
    this.interactions = {};
    this.styles = {};
}

OLMM.prototype.createMap = function (divName) {
    this.map = new ol.Map({
        target: divName,
        layers: this.firstLayers,
        view: new ol.View({
            center: [0, 0],
            zoom: 10
        })
    });
};

OLMM.prototype.init = function (divName) {
    this.createMap(divName);
};

OLMM.prototype.getInteractionsByName = function(name) {
    return this.interactions[name];
};

OLMM.prototype.getLayerByName = function(name) {
    return this.layers[name];
};

OLMM.prototype.getSourceByName = function(name) {
    return this.sources[name];
};

OLMM.prototype.getStyleByName = function (name) {
    return this.styles[name];
};

OLMM.prototype.addInteraction = function(name, interaction) {
    this.interactions[name] = interaction
};

OLMM.prototype.addSource = function(name, source) {
    this.sources[name] = source
};

OLMM.prototype.addLayer = function(name, layer) {
    this.layers[name] = layer;
    this.addSource(name, layer.getSource());
    if(this.map) {
        this.map.addLayer(layer);
    }
    else {
        this.firstLayers.push(layer);
    }
};

OLMM.prototype.setLayerVisible = function(layer_name, visible) {
    this.getLayerByName(layer_name).setVisible(visible);
};


