OLMM.prototype.transform = function (data)
{
    if(!data) return;
    var coords;
    if (data[0].length > 1)
    {
        coords = [];
        for (j = 0; j < data.length; j++)
        {
                coords[j] = ol.proj.transform(coords[j], 'EPSG:4326', 'EPSG:3857');
        }

    }
    else {coords = ol.proj.transform(data, 'EPSG:4326', 'EPSG:3857') }


    return coords;
};

OLMM.prototype.transformPointsToLine = function(features, line_source){

    var line_coords = [];

    for (var i = 0; i < features.length; i++){
        var old_feature = features[i];
        line_coords.push(old_feature.getGeometry().getCoordinates());
    }

    var feature = new ol.Feature({
        geometry: new ol.geom.LineString(line_coords)
    });

    if (old_feature) {
        var azimuth = old_feature.getProperties()['azimuth'];
        if (azimuth){
            feature.setProperties({azimuth: azimuth});
        }

        if (line_source) {
            line_source.addFeature(feature);
        }
    }
    return feature
};

OLMM.prototype.transformCoordsToLine = function(coords, line_source){
    var line_coords = [];

    for (var i = 0; i < coords.length; i++){
        line_coords.push(coords[i]); // TODO transform
    }

    var feature = new ol.Feature({
        geometry: new ol.geom.LineString(line_coords)
    });

    line_source.addFeature(feature);
};
