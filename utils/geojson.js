OLMM.prototype.readGeoJSON = function(geojson, id){

    console.log(geojson);

    var features, line_before, line_after, format;

    format = new ol.format.GeoJSON();

    features = format.readFeatures(geojson);

    for (var i = 0; i < features.length; i++) {
        var feature = features[i];

        var coords = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:4326', 'EPSG:3857');

        console.log(coords);

        var geometry_type = feature.getGeometry().getType();

        if (geometry_type == 'Point'){
            feature.setGeometry(new ol.geom.Point(coords))
        } else if (geometry_type == 'LineString'){
            feature.setGeometry(new ol.geom.LineString(coords));
            feature.setId('way-'+id)
        }

    }

    //features += format.readFeatures(line_after);
    return features;

};
