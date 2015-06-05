(function (module) {

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

    module.initHoverOnFeature = function() {
        var self = this;

        var selectMouseMove = new ol.interaction.Select({
            condition: ol.events.condition.pointerMove,
            layers: [self.getLayerByName('main')]
        });

        //self.map.addInteraction(selectMouseMove);
    };

    module.clearSource = function (source_name) {
        self.getSourceByName(source_name).clear();
    };

    module.clearSources = function () {
        for (var source_name in self.sources) {
            var source = self.getSourceByName(source_name);
            if (!!source.getFeatures) {
                source.clear();
            }
        }
    };

    module.mmTestNextGenAddFeatures = function(kwargs_data) {
        var self = this;
        var geojson_data = kwargs_data['geojson_data'] || [];
        var source_name = kwargs_data['source_name'] || '';
        var need_fit = kwargs_data['need_fit'] || false;

        var geojson = JSON.parse(JSON.stringify(geojson_data));
        var features = self.readGeoJSON(geojson, true);

        self.getSourceByName(source_name).addFeatures(features);

        if (need_fit){
            self.fitToExtent('main');
        }
    };

})(OLMM.prototype);
