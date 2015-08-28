(function (module) {

    module.addLayer = function (name, layer) {
        var self = this;

        self.layers[name] = layer;

        if (!self.getSourceByName(name)) {
            self.addSource(name, layer.getSource());
        }

        if (self.map) {
            self.map.addLayer(layer);
        }
        else {
            self.initLayers.push(layer);
        }
    };

    module.getLayerByName = function (name) {
        return this.layers[name];
    };

    module.getRelatedLayers = function (layerName) {
        var relatedLayers = this.relatedLayers[layerName];
        if (!relatedLayers) {
            this.relatedLayers[layerName] = []
        }
        return this.relatedLayers[layerName]
    };

    module.addRelatedLayer = function (layerName, relatedLayerName) {
        var relatedLayers = this.getRelatedLayers(layerName);
        relatedLayers.push(relatedLayerName);
    };

    module.getLayerVisible = function (layer_name) {
        return this.getLayerByName(layer_name).getVisible()
    };

    module.setLayerVisible = function (layer_name, visible) {
        var self = this;
        this.getLayerByName(layer_name).setVisible(visible);
        var relatedLayers = this.getRelatedLayers(layer_name);
        for (var i = 0; i < relatedLayers.length; i++) {
            var layer = self.getLayerByName(relatedLayers[i]);
                layer.setVisible(visible);
        }
    };

    module.toggleLayerVisible = function (layer_name) {
        var self = this;
        var layer = this.getLayerByName(layer_name);
        var new_layer_visible = !layer.getVisible();
        self.setLayerVisible(layer_name, new_layer_visible);
        return new_layer_visible;
    };

    module.createVectorClusterLayer = function (source, style) {
        return new ol.layer.Vector({
            source: source,
            style: style
        })
    };

    module.createIconLayer = function (coords, need_cluster, layer_style) {
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

    module.createOSMLayer = function () {
        var osm_layer = new ol.layer.Tile({
            preload: 3,
            source: new ol.source.OSM()
        });
        osm_layer.setProperties({layer_type: 'osm_layer'});
        return osm_layer;
    };

    module.createWMSLayer = function (server, layers, visible) {
        if (visible == undefined) {
            visible = true
        }

        var source = new ol.source.TileWMS({
            url: server,
            crossOrigin:'anonymous',
            params: {'LAYERS': layers, 'WIDTH': 256, 'HEIGHT': 256, 'VERSION': '1.1.1'},
            serverType: 'geoserver',
            attributions: [new ol.Attribution({
              html: "&copy 2015"
            })]
        });

        return new ol.layer.Tile({source: source, visible: visible});
    };

    module.createVectorLayer = function (style, features, source) {
        if (!source) {
            source = new ol.source.Vector();
        }

        if (features && features.length > 0) {
            source.addFeatures(features)
        }

        return new ol.layer.Vector({
            source: source,
            style: style
        });
    };

    module.loadWMSLayers = function (layers_data) {
        var self = this;

        layers_data.map(function (layer_data) {
            var layer_name = layer_data['layer_name'];
            var wms_conf = layer_data['wms_conf'];

            self.addLayer(layer_name, self.createWMSLayer(wms_conf['url'], wms_conf['layers'], wms_conf['visible']))
        })
    };

})(OLMM.prototype);
