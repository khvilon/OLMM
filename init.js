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

OLMM.prototype.getLayers = function (){
    var values = [];

    for (layer_name in this.layers){
        values.push(this.layers[layer_name]);
    }

    return values
};

OLMM.prototype.getLayer = function(layer_name){
    return this.layers[layer_name];
};

OLMM.prototype.addLayer = function (name, layer){
    this.layers[name] = layer;
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
        ]),
        view: new ol.View({
            center: [0, 0],
            zoom: 1
          })
      });

    var select = new ol.interaction.Select({
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                  color: '#000000'
                })
            })
          });

    this.map.addInteraction(select);

};

OLMM.prototype.transform = function (data) {
    return ol.proj.transform(data, 'EPSG:4326', 'EPSG:3857');
};

OLMM.prototype.fitToExtent = function (source) {
    this.map.getView().fitExtent(source.getExtent(), this.map.getSize());
};

OLMM.prototype.init = function (divName, selectPntFunction, mapClickFunction) {
    this.initDefaults();
    this.createLayers();
    this.createMap(divName);
    this.addPntSelect(selectPntFunction, mapClickFunction);
};

