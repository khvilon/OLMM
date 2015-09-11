var Cluster = function (options) {
    options = options || {};
    this.olmm = options['olmm'];
    this.updateCallback = options['updateCallback'];
    this.sourceName = options['sourceName'] || this.olmm.getDefaultSourceName();
    this.sourceClusterName = this.sourceName + 'Cluster';
    this.groupBy = options['groupBy'];

    this.olmm.addSource('neighborsSource');

    this.olmm.addLayer(this.sourceClusterName, this.olmm.createVectorLayer(
        this.olmm.getLayerByName(this.sourceName).getStyleFunction()
    ));

    this.olmm.addRelatedLayer(this.sourceName, this.sourceClusterName);
};


OLMM.prototype.enableCluster = function (options) {
    var self = this;
    var olmm = self;

    options = options || {};
    options['olmm'] = self;

    var cluster = new Cluster(options);

    cluster.update();
    self.clusters.push(cluster);
    return cluster;
};


Cluster.prototype.update = function () {
    var self = this;
    var olmm = self.olmm;

    if (olmm.getLayerVisible(self.sourceName) === false) {
        return;
    }

    var extent = olmm.map.getView().calculateExtent(olmm.map.getSize());

    olmm.clearSource(self.sourceClusterName);

    var features = olmm.getSourceByName(self.sourceName).getFeatures();
    // olmm.getPointFeaturesInExtent(extent, self.sourceName); // getPointsInExtent
    var clusters = self.getClusterPoints(features);

    olmm.getSourceByName(self.sourceClusterName).addFeatures(clusters);

    if (self.updateCallback) {
        self.updateCallback(self.sourceName, self.groupBy);
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
Cluster.prototype.getClusterPoints = function  (features) {
    var self = this;
    var olmm = self.olmm;

    var clusters = [];

    var clusteredPoints = [];
    var pointsWithoutCluster = [];

    for (var i = 0; i < features.length; i++) {
        var feature = features[i];
        // список фич которые уже в кластере
        if (clusteredPoints.indexOf(feature.getId()) != -1) {
            continue
        }

        var neighbors = self.getNeighbors(feature);

        if (neighbors.length > 1) {
            var center = self.getCenter(neighbors);
            // точка кластера и установка ей аналогичных свойств(влияет на ее стиль отображения)
            var clusterPoint = new ol.Feature(new ol.geom.Point(center));
            clusterPoint.setProperties(self.getClusterPointProperties(neighbors));
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

Cluster.prototype.getNeighbors = function (feature) {
    var self = this;
    var olmm = self.olmm;

    var mapDistance = olmm.getConfigValue('clusterDistance') || 30;
    mapDistance *= olmm.map.getView().getResolution();

    var coords = feature.getGeometry().getCoordinates();

    // кластеризуемый квадрат вокруг точки
    var featureExtent = [
        coords[0] - mapDistance, coords[1] - mapDistance, coords[0] + mapDistance, coords[1] + mapDistance
    ];

    var featureProperties = feature.getProperties() || {};
    // отбираем в кластеризуемом квадрате нужные точки (соседи)
    var neighbors = olmm.getPointFeaturesInExtent(featureExtent, self.sourceName);
    if (self.groupBy) {
        neighbors = neighbors.filter(function (f) {
            return f.getProperties()[groupBy] == featureProperties[self.groupBy];
        });
    }
    return neighbors
};

Cluster.prototype.getCenter = function  (neighbors) {

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

Cluster.prototype.getClusterPointProperties = function (neighbors) {
    var propsCallback = this.olmm.getConfigValue('clusterPropertyCallback');
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
    clusterPointProperties['count'] = neighbors.length;
    clusterPointProperties['neighbors'] = neighbors;
    if (propsCallback) {
        clusterPointProperties = propsCallback(clusterPointProperties)
    }
    return clusterPointProperties;
};

OLMM.prototype.expandCluster = function (event, feature) {
    var olmm = this;
    var neighborsSourceName = 'neighborsSource';
    olmm.clearSource(neighborsSourceName);
    olmm.getSourceByName(neighborsSourceName).addFeatures(feature.getProperties()['neighbors']);
    olmm.fitToExtent(neighborsSourceName);
};
