OLMM.prototype.readGeoJSON = function(geojson, each_feature_function, addition_params) {
    var features, coords, geometry_type, format, i, style, feature_properties, j;

    format = new ol.format.GeoJSON();

    console.log(geojson);

    features = format.readFeatures(geojson);

    var rewrite_features = [];

    for (i = 0; i < features.length; i++) {
        var feature = features[i];

        geometry_type = feature.getGeometry().getType();
        coords = feature.getGeometry().getCoordinates();

        if (geometry_type == 'LineString') {
            for (j = 0; j < coords.length; j++) {
                coords[j] = ol.proj.transform(coords[j], 'EPSG:4326', 'EPSG:3857');
            }
        } else if (geometry_type == 'Point') {
            coords = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:4326', 'EPSG:3857');
        }

        if (geometry_type == 'Point') {
            feature.setGeometry(new ol.geom.Point(coords))
        } else if (geometry_type == 'LineString') {
            feature.setGeometry(new ol.geom.LineString(coords));
        }

        if (each_feature_function) {
            feature = each_feature_function(feature, addition_params || {})
        }
    }
    return rewrite_features;
};
