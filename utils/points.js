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
