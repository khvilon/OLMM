OLMM.prototype.transformPointsToLine = function(features, style){
    var line_coords = [];

    for (var i = 0; i < features.length; i++){
        var feature = features[i];
        line_coords.push(feature.getGeometry().getCoordinates());
    }

    feature = new ol.feature.Feature({
        geometry: new ol.geom.LineString(coords, style)
    });

    return [feature]
};