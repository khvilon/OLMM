function OLMM() {}

window.olmm_server_config = {
    'preload': 3,
    //'wms_server':'http://10.0.2.60/mapcache/', // http://10.0.2.60/mapcache/demo/wms or http://10.0.2.60/mapcache/demo/wmts
    'tiled': true,
    'wms_layers': 'roads'
};

OLMM.prototype.getMainLayers = function(){
    var config = window.olmm_server_config;

    var osm_layer = new ol.layer.Tile({
        preload: config['preload'] || 3,
        source: new ol.source.OSM()
    });
    osm_layer.setProperties({layer_type: 'osm_layer'});
    this.osm_layer = osm_layer;

    var layers = [osm_layer];

    if (config['wms_server']) {
        var wms_layer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: config['wms_server'],
                params: {'LAYERS': config['wms_layers'], 'TILED': true},
                serverType: 'geoserver'
            })
        });
        wms_layer.setProperties({layer_type: 'wms_layer'});
        layers.push(wms_layer);
        this.wms_layer = wms_layer;
    }

    return layers;
};

OLMM.prototype.createMap = function (divName) {
    this.map = new ol.Map({
        target: divName,
        layers: this.getMainLayers().concat([
            this.lineLayer,
            this.graphLayer,
            this.graphLayer2,
            this.lastProjLayer,
            this.allProjLayer,
            this.mmProjLayer,
            this.goodProjLayer,
            this.pntsLayer,
            this.geoJSONLayer
        ])
      });

};

OLMM.prototype.init = function (divName, selectPntFunction, mapClickFunction) {
    this.initDefaults();
    this.createLayers();
    this.createMap(divName);
    this.addPntSelect(selectPntFunction, mapClickFunction);
};

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

    return layer;
};
