(function (module) {

    module.initLayers = function() {
        var self = this;

        if (!self.getLayerByName('osm')) {
            self.addLayer('osm', self.createOSMLayer());
        }

        if (!self.getLayerByName('tdrs')) {
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

        if (!self.getLayerByName('lines')) {
            self.addLayer('lines', self.createVectorLayer(function (feature, resolution) {

                var featureStateMap = {
                    'good': 'lightgreen',
                    'good_selected': 'green',
                    'bad': 'lightcoral',
                    'bad_selected': 'red',
                    'selected': 'darkorange'
                };

                var featureState = feature.getProperties()['state'];
                var featurePriorityState = feature.getProperties()['priorityState'];
                var color = featureStateMap[featurePriorityState] || featureStateMap[featureState] || 'transparent';

                var geometry = feature.getGeometry();
                var styles = [
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: color,
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
                                color: color,
                                width: 2
                            })
                        })
                    }));
                });

                return styles;
            }));
        }

        if (!self.getLayerByName('main')) {
            self.addLayer('main', self.createVectorLayer(function (feature, resolution) {

                var featureStateMap = {
                    'selected': 'yellow'
                };
                var featureState = feature.getProperties()['state'];
                var featurePriorityState = feature.getProperties()['priorityState'];
                var color = featureStateMap[featurePriorityState] || featureStateMap[featureState] || 'black';

                return [new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: color,
                            opacity: 1
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'black',
                            opacity: 1
                        })
                    })
                })]
            }));
        }
    };

    module.initHoverOnFeature = function() {
        // TODO cursor or pointer object with events
        var self = this;

        var selectMouseMove = new ol.interaction.Select({
            condition: ol.events.condition.pointerMove,
            layers: [self.getLayerByName('main')]
        });

        //self.map.addInteraction(selectMouseMove);
    };

    module.mmTestNextGenAddFeatures = function(options) {
        module.addFeaturesFromGeoJSON(options); // backward compability
    };

    module.toggleFeature = function (feature) {
        var self = this;
        self.unSelectFeatures('main');
        self.unSelectFeatures('lines');

        var featureId = feature.getId();

        if (self._lastSelectedPoint != undefined && featureId == self._lastSelectedPoint) {
            self._lastSelectedPoint = undefined;
            return;
        } else {
            self._lastSelectedPoint = featureId;
        }

        self.selectFeature(feature);
    };

    module.selectFeature = function (feature) {
        var self = this;

        var featureState = feature.getProperties()['state'];
        var featurePriorityState = feature.getProperties()['priorityState'];
        var state = featurePriorityState || featureState;

        var featureId = feature.getId();

        self.setFeatureState(feature, self.getFeatureStateForSelect(state));

        self.getSourceByName('lines').getFeatures().map(function(projection){
            if (projection.getProperties()['point_id'] == featureId) {
                var projState = projection.getProperties()['state'];
                var projPriorityState = projection.getProperties()['priorityState'];
                var state = projPriorityState || projState;
                self.setFeatureState(projection, self.getFeatureStateForSelect(state));
                projection.changed();
            }
        });

        self.showProjections(feature, 'lines');
    };

    module.setFeatureState = function (feature, state) {
        feature.setProperties({'priorityState': state});
        feature.changed();
    };

    module.getFeatureStateForSelect = function (state) {
        if (state) {
            return state += '_selected'
        } else {
            return 'selected'
        }
    }

})(OLMM.prototype);
