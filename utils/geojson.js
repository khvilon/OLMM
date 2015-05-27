OLMM.prototype.readGeoJSON = function(geojson, id){
    var features, coords, geometry_type, format, i, style, feature_properties, j;

    format = new ol.format.GeoJSON();

    features = format.readFeatures(geojson);
    var rewrite_features = [];

    for (i = 0; i < features.length; i++) {
        var feature = features[i];

        feature_properties = feature.getProperties();
        geometry_type = feature.getGeometry().getType();
        coords = feature.getGeometry().getCoordinates();

        if (geometry_type == 'LineString') {
                for(j = 0; j < coords.length;j++) {
                    coords[j] = ol.proj.transform(coords[j], 'EPSG:4326', 'EPSG:3857');
                }
        } else if (geometry_type == 'Point') {
            coords = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:4326', 'EPSG:3857');
        }

        if (geometry_type == 'Point'){
            feature.setGeometry(new ol.geom.Point(coords))
        } else if (geometry_type == 'LineString'){
            feature.setGeometry(new ol.geom.LineString(coords));

        }
        if (feature_properties['color']) {
            style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: feature_properties['color'],
                    opacity: 1,
                    width: 6
                }),
                stroke: new ol.style.Stroke({
                    color: feature_properties['color'],
                    opacity: 1,
                    width: 6
                })
            });
            feature.setStyle(style);
        }

        if (id) {
            feature.setId('way-'+id)
        }

        rewrite_features.push(feature);
    }
    return rewrite_features;
};
