OLMM.prototype.readGeoJSON = function(geojson){

    console.log(geojson);

    var features, line_before, line_after, format;

    format = new ol.format.GeoJSON();

    features = format.readFeatures(geojson);

    //features += format.readFeatures(line_after);
    return features;

};
