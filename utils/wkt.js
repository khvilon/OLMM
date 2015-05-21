OLMM.prototype.readWKT = function(wkt, layer){
    var format = ol.format.WKT();
    var feature = format.readFeature(wkt);

    feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');

    layer.addFeature(feature);
};
