OLMM.prototype.getPointFeaturesInExtent = function (extent, sourceName) {
    var self = this;
    var source = self.getSourceByName(sourceName);

    return source.getFeaturesInExtent(extent).filter(function (feature) {
        return feature.getGeometry().getType() == self.pointName
    });
};

OLMM.prototype.enableCluster = function (sourceName, groupBy) {
    var self = this;
    self.map.getView().on('propertychange', function (e) {
        switch (e.key) {
            case 'resolution':
                self.updateCluster(sourceName, groupBy);
        }
    });
    self.updateCluster(sourceName, groupBy);
};

OLMM.prototype.updateCluster = function (sourceName, groupBy) {
    var self = this;

    var extent = self.map.getView().calculateExtent(self.map.getSize());

    groupBy = 'name';
    sourceName = sourceName || self.getDefaultSourceName() || 'edit';
    var sourceClusterName = sourceName + 'Cluster';

    self.addLayer(sourceClusterName, self.createVectorLayer(
        function (f, r) {
            return [new ol.style.Style({
                image: new ol.style.Icon({
                    src: 'http://icons.iconarchive.com/icons/icojam/blueberry-basic/32/check-icon.png'
                }),
                text: new ol.style.Text({
                    text: f.getProperties()['count'],
                    size: 24,
                    fill: new ol.style.Fill({
                        color: '#000000'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#000000'
                    })
                })
            })]
        }
    ));

    self.clearSource(sourceClusterName);
    var clusterSource = self.getSourceByName(sourceClusterName);
    var features = self.getPointFeaturesInExtent(extent, sourceName);

    var featuresGroup = {};

    for (var i = 0; i < features.length; i++) {
        var feature = features[i];

        var featureProperties = feature.getProperties() || {};

        var groupByValue = featureProperties[groupBy];

        if (groupByValue in featuresGroup) {
            featuresGroup[groupByValue].push(feature)
        } else {
            featuresGroup[groupByValue] = [feature]
        }
    }

    console.log(featuresGroup);

    var clusterFeatures = [];
    var skipFeaturesId = [];

    for (groupByValue in featuresGroup) {
        features = featuresGroup[groupByValue];
        var length = features.length;

        for (i = 0; i < length; i++) {
            feature = features[i];

            if (skipFeaturesId.indexOf(feature.getId()) != -1) {
                continue
            }

            var center = [0, 0];

            var featureCoords = feature.getGeometry().getCoordinates();

            var consta = 20 * olmm.map.getView().getResolution();

            var featureExtent = [
                featureCoords[0] - consta, featureCoords[1] - consta, featureCoords[0] + consta, featureCoords[1] + consta
            ];

            var neighbors = self.getPointFeaturesInExtent(featureExtent, sourceName);
            console.log(neighbors.length);
            console.log(neighbors.map(function (f) {
                return f.getId()
            }));

            neighbors.forEach(function (f) {
                skipFeaturesId.push(f.getId());
                var geometry = f.getGeometry();
                var coordinates = geometry.getCoordinates();

                center[0] += coordinates[0];
                center[1] += coordinates[1];
            });

            if (neighbors.length > 1) {
                center[0] *= 1 / neighbors.length;
                center[1] *= 1 / neighbors.length;
            }

            var clusterPoint = new ol.Feature(new ol.geom.Point(center));
            if (neighbors.length > 1) {
                clusterPoint.setProperties({'count': neighbors.length});
            }

            clusterFeatures.push(clusterPoint)
        }
    }

    self.setLayerVisible(sourceName, false);
    clusterSource.addFeatures(clusterFeatures);
    self.setLayerVisible(sourceClusterName, true);

};
