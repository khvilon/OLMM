(function (module) {
    module.mmTestNextGenAddFeatures = function(geojsonData) {
        this._clearAllSources();
        this._addFeatures(geojsonData, true)
    };

    module.mmTestNextGenAddDynamicFeatures = function(geojsonData) {
        this._addFeatures(geojsonData, false)
    };

    module.mmTestDeleteFeatureById = function(feature_id) {
        var source_name, source, point_feature;

        for (source_name in this.sources) {
            source = this.getSourceByName(source_name);
            if (!!source.getFeatures) {
                point_feature = source.getFeatureById(feature_id);

                source.removeFeature(source.getFeatureById(feature_id));
            }
        }
    };

    module.initLayers = function() {
        var self = this;

        if (!self.getLayerByName('osm')){
            self.addLayer('osm', self.createOSMLayer(self.createOSMLayer()));
        }

        if (!self.getLayerByName('lines')){
            self.addLayer('lines', self.createVectorLayer(self.styleGraphFunction));
        }

        if (!self.getLayerByName('main')){
            self.addLayer('main', self.createVectorLayer(
                new ol.style.Style({ // TODO
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: 'black',
                            opacity: 1
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'black',
                            opacity: 1
                        })
                    })
                })
                )
            );
        }

    };

    module._clearAllSources = function() {
        var source_name, source;

        for (source_name in this.sources) {
            source = this.getSourceByName(source_name);
            if (!!source.getFeatures) {
                source.clear();
            }
        }
    };

    module._addFeatures = function(geojson_data, need_fit) {
        var self = this;

        var json_string = JSON.stringify(geojson_data);
        var geojson = JSON.parse(json_string);

        var features = self.readGeoJSON(geojson, true);

        self.getSourceByName('main').addFeatures(features);

        self.transformPointsToLine(features, 'lines');

        if (need_fit){
            self.fitToExtent('lines');
        }
    };

})(OLMM.prototype);