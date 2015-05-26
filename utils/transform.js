OLMM.prototype.transformPointsToLine = function(features, line_source){
    var line_coords = [];

    for (var i = 0; i < features.length; i++){
        var feature = features[i];
        line_coords.push(feature.getGeometry().getCoordinates());
    }

    feature = new ol.feature.Feature({
        geometry: new ol.geom.LineString(line_coords)
    });

    return [feature]
};
