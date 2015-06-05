(function (module) {
    module.mmTestNextGenAddFeaturesWithFullClean = function(geojsonData, source_name) {
        this._clearSources();
        this._addFeatures(geojsonData, source_name, true)
    };

    module.mmTestNextGenAddFeaturesWithClean = function(geojsonData, source_name) {
        this._clearSources(source_name);
        this._addFeatures(geojsonData, source_name, true)
    };

    module.mmTestNextGenAddDynamicFeatures = function(geojsonData, source_name) {
        this._addFeatures(geojsonData, source_name, false)
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

    module.initHoverOnFeature = function() {
        var self = this;

        var selectMouseMove = new ol.interaction.Select({
            condition: ol.events.condition.pointerMove,
            layers: [self.getLayerByName('main')]
        });

        //self.map.addInteraction(selectMouseMove);
    };

    module.initLayers = function() {
        var self = this;

        if (!self.getLayerByName('osm')){
            self.addLayer('osm', self.createOSMLayer());
        }

        if (!self.getLayerByName('tdrs')){
            self.addLayer('tdrs', self.createVectorLayer(
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'blue',
                        width: 3
                    }),
                    fill: new ol.style.Fill({
                        color: 'blue'
                    })
                })
            ));
        }

        if (!self.getLayerByName('lines')){
            self.addLayer('lines', self.createVectorLayer(function (feature, resolution) {

                var featureStateMap = {
                    'good': 'darkgreen',
                    'good_selected': 'green'
                };
                var featureState = feature.getProperties()['state'];

                var geometry = feature.getGeometry();
                var styles = [
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: featureStateMap[featureState] || 'dark',
                            width: 2
                        })
                    })
                ];

                geometry.forEachSegment(function (start, end) {
                    styles.push(new ol.style.Style({
                        geometry: new ol.geom.Point(end),
                        image: new ol.style.Circle({
                            radius: 4,
                            stroke: new ol.style.Stroke({
                                color: featureStateMap[featureState] || 'dark',
                                width: 2
                            })
                        })
                    }));
                });

                return styles;
            }));
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

    module._clearSources = function(source_name) {
        var self = this;

        if (source_name) {
            self.getSourceByName(source_name).clear();
        } else {
            for (source_name in self.sources) {
                var source = self.getSourceByName(source_name);
                if (!!source.getFeatures) {
                    source.clear();
                }
            }
        }
    };

    module._addFeatures = function(geojson_data, source_name, need_fit) {
        var self = this;

        var json_string = JSON.stringify(geojson_data);
        var geojson = JSON.parse(json_string);

        var features = self.readGeoJSON(geojson, true);

        self.getSourceByName(source_name).addFeatures(features);

        //self.transformPointsToLine(features, 'lines');

        if (need_fit){
            self.fitToExtent('main');
        }
    };

})(OLMM.prototype);
