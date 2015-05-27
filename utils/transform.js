OLMM.prototype.transformPointsToLine = function(features, line_source){
    var line_coords = [];

    for (var i = 0; i < features.length; i++){
        var feature = features[i];
        line_coords.push(feature.getGeometry().getCoordinates());
    }

    feature = new ol.Feature({
        geometry: new ol.geom.LineString(line_coords)
    });

    line_source.addFeature(feature);
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
