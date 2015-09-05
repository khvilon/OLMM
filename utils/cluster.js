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

    sourceName = sourceName || self.getDefaultSourceName();
    var sourceClusterName = sourceName + 'Cluster';

    self.addSource('neighborsSource');

    self.addLayer(sourceClusterName, self.createVectorLayer(
        self.getLayerByName(sourceName).getStyleFunction()
    ));

    self.addRelatedLayer(sourceName, sourceClusterName);

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

    if (self.getLayerVisible(sourceName) === false) {
        return;
    }
    // расстояние между кластеризуемыми точками
    var extent = self.map.getView().calculateExtent(self.map.getSize());
    var sourceClusterName = sourceName + 'Cluster';
    self.clearSource(sourceClusterName);
    var clusterSource = self.getSourceByName(sourceClusterName);
    // фичи в экстенте
    var features = self.getPointFeaturesInExtent(extent, sourceName); // getPointsInExtent
    var clusters = self.getClusters(features, groupBy, sourceName);

    clusterSource.addFeatures(clusters);

    var callback = self.config['updateClusterCallback'];
    if (callback) {
        callback(sourceName, groupBy);
    }
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
 * @param sourceName
 * @returns {Array}
 */
OLMM.prototype.getClusters = function  (features, groupBy, sourceName) {
    var self = this;
    var clusters = [];
    var clusteredPoints = [];
    var pointsWithoutCluster = [];

    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        // список фич которые уже в кластере
        if (clusteredPoints.indexOf(feature.getId()) != -1) {
            continue
        }
        var neighbors = self.getNeighbors(feature, groupBy, sourceName);

        if (neighbors.length > 1) {
            var center = self.getClusterCenter(neighbors);
            // точка кластера и установка ей аналогичных свойств(влияет на ее стиль отображения)
            var clusterPoint = new ol.Feature(new ol.geom.Point(center));
            clusterPoint.setProperties(self.getClusterProperties(neighbors));
            clusterPoint.setProperties({'visible': true});
            clusters.push(clusterPoint);

            neighbors.forEach(function(f){
                clusteredPoints.push(f.getId());
                f.setProperties({'visible': false})
            });
        } else {
            var f = neighbors[0];
            pointsWithoutCluster.push(f.getId());
            f.setProperties({'visible': true})
        }
    }
    return clusters;
};

OLMM.prototype.getNeighbors = function (feature, groupBy, sourceName) {
    var self = this;

    var mapDistance = self.getConfigValue('clusterDistance') || 30;
    mapDistance *= self.map.getView().getResolution();

    var coords = feature.getGeometry().getCoordinates();

    // кластеризуемый квадрат вокруг точки
    var featureExtent = [
        coords[0] - mapDistance, coords[1] - mapDistance, coords[0] + mapDistance, coords[1] + mapDistance
    ];

    var featureProperties = feature.getProperties() || {};
    // отбираем в кластеризуемом квадрате нужные точки (соседи)
    var neighbors = self.getPointFeaturesInExtent(featureExtent, sourceName);
    if (groupBy) {
        neighbors = neighbors.filter(function (f) {
            return f.getProperties()[groupBy] == featureProperties[groupBy];
        });
    }
    return neighbors
};

OLMM.prototype.getClusterCenter = function  (neighbors) {
    var self = this;

    var clusterCenter = neighbors.reduce(function(center, feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        center[0] += coordinates[0];
        center[1] += coordinates[1];
        return center
    }, [0, 0]);

    if (neighbors.length > 1) {
        clusterCenter[0] /= neighbors.length;
        clusterCenter[1] /= neighbors.length;
    }
    return clusterCenter;
};

OLMM.prototype.getClusterProperties = function (neighbors) {
    var propsCallback = this.getConfigValue('clusterPropertyCallback');
    var clusterPointProperties = {};

    if (neighbors.length > 0) {
        var props = neighbors[0].getProperties();
        var exceptProps = ['geometry'];

        clusterPointProperties = {};
        for (var key in props) {
            if (exceptProps.indexOf(key) == -1) {
                clusterPointProperties[key] = props[key]
            }
        }
    }
    if (neighbors.length > 1) {
        clusterPointProperties['count'] = neighbors.length;
        clusterPointProperties['neighbors'] = neighbors;
    }
    if (propsCallback) {
        clusterPointProperties = propsCallback(clusterPointProperties)
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
