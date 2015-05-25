OLMM.prototype. readGeoJSON = function(geojson, id){
    var features, line_before, line_after, format, i;

    format = new ol.format.GeoJSON();

    features = format.readFeatures(geojson);

    for (i = 0; i < features.length; i++) {
        var feature = features[i];

        console.log(feature.getProperties());

        var coords = feature.getGeometry().getCoordinates();
        if (coords[0].length > 0)
        {
            for(i = 0; i < coords.length;i++)
                coords[i] = ol.proj.transform(coords[i], 'EPSG:4326', 'EPSG:3857'); 
        }
        else coords = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:4326', 'EPSG:3857');

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
