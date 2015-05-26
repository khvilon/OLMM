OLMM.prototype.readGeoJSON = function(geojson, id){
    var features, coords, geometry_type, format, i, style, feature_properties;

    format = new ol.format.GeoJSON();

    features = format.readFeatures(geojson);

    for (i = 0; i < features.length; i++) {
        var feature = features[i];

        feature_properties = feature.getProperties();
        geometry_type = feature.getGeometry().getType();
        coords = feature.getGeometry().getCoordinates();

        if (geometry_type == 'LineString') {
            if (coords[0].length > 0) {
                for(i = 0; i < coords.length;i++) {
                    coords[i] = ol.proj.transform(coords[i], 'EPSG:4326', 'EPSG:3857');
                }
            }
            feature.setGeometry(new ol.geom.LineString(coords));
        } else if (geometry_type == 'Point') {
            coords = ol.proj.transform(coords, 'EPSG:4326', 'EPSG:3857');
            feature.setGeometry(new ol.geom.Point(coords))
        }

        if (feature_properties['color']) {
            style = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: feature_properties['color'],
                    opacity: 1
                }),
                stroke: new ol.style.Stroke({
                    color: feature_properties['color'],
                    opacity: 1
                })
            })
        } else {
            style = new ol.style.Style();
        }

        feature.setStyle(style)

        if (geometry_type == 'Point'){
            feature.setGeometry(new ol.geom.Point(coords))
        } else if (geometry_type == 'LineString'){
            feature.setGeometry(new ol.geom.LineString(coords));
        }

        if (id) {
            feature.setId('way-'+id)
        }
    }
    return features;
};
