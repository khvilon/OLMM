OLMM.prototype.points_features_from_coords = function(json_data) {

    var lon, lat, tdr_data, point_coords, geometry, point_feature, layer, source;
    var point_features = [];
    var tdr_coords = [];

    for (var i = 0; i < json_data.length; i++) {
        lon = json_data[i][0];
        lat = json_data[i][1];

        point_coords = this.transform([lon, lat]);

        geometry = new ol.geom.Point(point_coords);

        point_feature = new ol.Feature({geometry: geometry});

        point_features.push(point_feature);
    }

    return point_features

};

OLMM.prototype.makePointFromLonLat = function (lon, lat, source_name) {
    var self = this;
    var map_coords = self.transform([parseFloat(lon), parseFloat(lat)]);
    var geometry = new ol.geom.Point(map_coords);
    var point = new ol.Feature({geometry: geometry});
    point.setRandomId();
    self.getSourceByName(source_name || self.getDefaultSourceName()).addFeature(point);
    return point;
};

OLMM.prototype.makePoint = function (lon, lat, sourceName) {
    return this.makePointFromLonLat(lon, lat, sourceName)
};
