OLMM.prototype.createVectorClusterLayer = function (source, style) {
    return new ol.layer.Vector({
        source: source,
        style: style
    })
};

OLMM.prototype.createIconLayer = function (coords, need_cluster, layer_style) {
    var point, feature, icon_style, i, source;
    var features = [];

    for (i = 0; i < coords.length; ++i) {
        point = new ol.geom.Point(coords[i]);

        feature = new ol.Feature(point);

        features.push(feature);
    }

    source = new ol.source.Vector({features: features});

    if (need_cluster == true) {
        source = this.createClusterSource(source);
    }

    source.addFeatures(features);

    var layer = this.createVectorClusterLayer(source, layer_style);

    return layer;
};


OLMM.prototype.createOSMLayer = function () {
    var osm_layer = new ol.layer.Tile({
        preload: 3,
        source: new ol.source.OSM()
    });
    osm_layer.setProperties({layer_type: 'osm_layer'});
    return osm_layer;
};


OLMM.prototype.createWMSLayer = function (server, layers, visible) {
    if (visible == undefined) {
        visible = true
    }

    var source = new ol.source.TileWMS({
        url: server,
        params: {'LAYERS': layers, 'TILED': true},
        serverType: 'geoserver'
    });

    return new ol.layer.Tile({source: source, visible: visible});
};


OLMM.prototype.createVectorLayer = function (style, features) {
    var source = new ol.source.Vector();

    if (features && features.length > 0) {
        source.addFeatures(features)
    }

    return new ol.layer.Vector({
        source: source,
        style: style
    });
};

OLMM.prototype.loadWMSLayers = function (layers_data) {
    var self = this;

    layers_data.map(function(layer_data){
        var layer_name = layer_data['layer_name'];
        var wms_conf = layer_data['wms_conf'];

        self.addLayer(layer_name, self.createWMSLayer(wms_conf['url'], wms_conf['layers'], wms_conf['visible']))
    })
};
