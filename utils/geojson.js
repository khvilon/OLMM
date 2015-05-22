OLMM.prototype.readGeoJSON = function(geojson){

    console.log(geojson);

    var features, line_before, line_after, format;

    format = new ol.format.GeoJSON({

    });

    features = format.readFeatures(geojson);

    for (var i = 0; i < features.length; i++) {
        var feature = features[i];

        var coords = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:4326', 'EPSG:3857');

        console.log(coords);

        feature.setGeometry(new ol.geom.Point(coords))
    }

    //features += format.readFeatures(line_after);
    return features;

};
