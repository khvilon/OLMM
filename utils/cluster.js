OLMM.prototype.getPointFeaturesInExtent = function (extent, sourceName) {
    var self = this;
    var source = self.getSourceByName(sourceName);

    var features = source.getFeaturesInExtent(extent);

    return features.filter(function (feature) {
        return feature.getGeometry().getType() == self.pointName
    });
};

OLMM.prototype.enableCluster = function (sourceName, groupBy) {
    var self = this;

    sourceName = sourceName || self.getDefaultSourceName() || 'edit';
    var sourceClusterName = sourceName + 'Cluster';

    self.addSource('neighborsSource');

    self.addLayer(sourceClusterName, self.createVectorLayer(
        self.getLayerByName(sourceName).getStyleFunction()
    ));

    self.map.getView().on('propertychange', function (e) {
        switch (e.key) {
            case 'resolution':
                self.updateCluster(sourceName, groupBy);
        }
    });
    self.updateCluster(sourceName, groupBy);
};

/**
 * Кластеризует точки
 * @param sourceName
 * @param groupBy название свойства по которому будем группировать точки
 */
OLMM.prototype.updateCluster = function (sourceName, groupBy) {
    var self = this;
    // кластеризованные точки
    self.clusteredPoints = [];
    self.pointsWithoutCluster = [];
    // расстояние между кластеризуемыми точками
    self.clusterDisance = 20;
    var extent = self.map.getView().calculateExtent(self.map.getSize());
    var sourceClusterName = sourceName + 'Cluster';
    self.clearSource(sourceClusterName);
    var clusterSource = self.getSourceByName(sourceClusterName);
    // фичи в экстенте
    var features = self.getPointFeaturesInExtent(extent, sourceName); // getPointsInExtent
    var clusters = self.getClusters(features, groupBy);

    clusterSource.addFeatures(clusters);
};

/**
// 1) рассчет mapdistance расстояние между точками в зависимосте от зума
// 2) проверка надо ли рисовать фичу, или она уже в кластере (такие пропускаем)
// 3) ищет соседей точки такого же типа
// 4) поиск координат кластера
// 5) стилим точку кластера
// 6) создаем точку кластера на карте
 * @param features
 * @param groupBy
 * @returns {Array}
 */
OLMM.prototype.getClusters = function  (features, groupBy) {
    var self = this;
    var clusters = [];
    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        // список фич которые уже в кластере
        if (self.clusteredPoints.indexOf(feature.getId()) != -1) {
            continue
        }
        var neighbors = self.getNeighbors(feature, groupBy);

        if (neighbors.length > 1) {

            neighbors.forEach(function(feature){
                feature.setProperties({'visible': false})
            });

            var center = self.getClusterCenter(neighbors);
            // генерим свойства для стиля кластера
            var clusterPointProperties = self.getClusterProperties(neighbors);
            var clusterPoint = new ol.Feature(new ol.geom.Point(center));
            clusterPoint.setProperties(clusterPointProperties);
            clusters.push(clusterPoint)
        } else {
            var f = neighbors[0];
            self.pointsWithoutCluster.push(f.getId());
            f.setProperties({"visible": true});
        }
    }
    return clusters;
};

OLMM.prototype.getNeighbors = function (feature, groupBy) {
    var self = this;

    var mapDistance = self.clusterDisance * self.map.getView().getResolution();
    var coords = feature.getGeometry().getCoordinates();

    // кластеризуемый квадрат вокруг точки
    var featureExtent = [
        coords[0] - mapDistance, coords[1] - mapDistance, coords[0] + mapDistance, coords[1] + mapDistance
    ];

    var featureProperties = feature.getProperties() || {};
    // отбираем в кластеризуемом квадрате нужные точки (соседи)
    return self.getPointFeaturesInExtent(featureExtent, 'edit').filter(function (f) {
        return f.getProperties()[groupBy] == featureProperties[groupBy];
    });
};

OLMM.prototype.getClusterCenter = function  (neighbors) {
    var self = this;
    var center = [0, 0];
    // находим центр будущего кластера
    neighbors.forEach(function (f) {
        self.clusteredPoints.push(f.getId());
        var geometry = f.getGeometry();
        var coordinates = geometry.getCoordinates();

        center[0] += coordinates[0];
        center[1] += coordinates[1];
    });

    if (neighbors.length > 1) {
        center[0] /= neighbors.length;
        center[1] /= neighbors.length;
    }
    return center;
};

OLMM.prototype.getClusterProperties = function (neighbors) {
    var clusterPointProperties = {};
    if (neighbors.length > 0) {
        var props = neighbors[0].getProperties();
        var state = props['_state'] || '';
        state.replace('selected', 'default');
        clusterPointProperties = {
            visible: true,
            objecttype: props['objecttype'],
            _state_additional: props['_state_additional'],
            _state: state
        }
    }
    if (neighbors.length > 1) {
        clusterPointProperties['count'] = neighbors.length;
        clusterPointProperties['neighbors'] = neighbors;
    }
    return clusterPointProperties;
};

OLMM.prototype.clusterClickHandleFunction = function (event, feature) {
    var self = this;
    var neighborsSourceName = 'neighborsSource';
    self.clearSource(neighborsSourceName);
    self.getSourceByName(neighborsSourceName).addFeatures(feature.getProperties()['neighbors']);
    self.fitToExtent(neighborsSourceName);
};

OLMM.prototype.addClusterClickFunction = function (layer_name) {
    var self = this;
    var layer;

    layer_name += 'Cluster';

    if (layer_name) {
        layer = self.getLayerByName(layer_name);
    }

    self.map.on('singleclick', function (event) {
        var feature = this.getFeatureAtPixel(event.pixel, layer);
        if (feature) {
            self.clusterClickHandleFunction(event, feature);
        }
    });
};
