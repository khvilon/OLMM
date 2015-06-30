OLMM.prototype.get_tdr_from_json_data = function (json_data) {
    var first_point, lon, lat, second_point, tdr_data, point_coords, geometry, point_feature;
    var point_features = [];
    var tdr_coords = [];

    for (var i = 0; i < json_data.length; i++) {
        tdr_data = json_data[i];

        for (var j = 0; j < tdr_data.length; j++) {
            lon = tdr_data[j][0];
            lat = tdr_data[j][1];

            point_coords = this.transform(lon, lat);

            geometry = new ol.geom.Point(point_coords);

            point_feature = new ol.Feature({geometry: geometry});

            point_features.push(point_feature);
        }

    }
};

OLMM.prototype.draw_tdr_features = function(tdr_features, source_name){
    var i, j, point_features, source, features;

    features = [];

    for (i = 0; i < tdr_features.length; i++){
        point_features = tdr_features[i];

        for (j = 0; j < point_features.length; j++) {
            features.push(point_features[j])
        }
    }

    source = this.getSourceByName(source_name);

    source.addFeatures(features);
};
