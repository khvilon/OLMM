OLMM.prototype.initDefaults = function() {
    this.layers = {};
    this.sources = {};
};

OLMM.prototype.getLayerByName = function(name) {
    return this.layers[name];
};

OLMM.prototype.getSourceByName = function(name) {
    return this.sources[name];
};

OLMM.prototype.addSource = function(name, source) {
    this.sources[name] = source
};

OLMM.prototype.addLayer = function(name, layer) {
    this.layers[name] = layer;
    this.map.addLayer(layer);
};

OLMM.prototype.createVectorLayer = function(name, features, style) {
    var source = new ol.source.Vector();

    if (features && features.length > 0) {
        source.addFeatures(features)
    }

    var layer = new ol.layer.Vector({
        source: source,
        style: style
    });

    this.addSource(name, source);
    this.addLayer(name, layer);
};
