OLMM.prototype.readGeoJSON = function(geojson){

    var features, line_before, line_after, format;

    features = [];

    //line_before = geojson['line_before'];
    //line_after = geojson['line_after'];

    format = new ol.format.GeoJSON();

    return format.readFeatures(geojson);
    //features += format.readFeatures(line_after);

    //return features;

    //feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
};
